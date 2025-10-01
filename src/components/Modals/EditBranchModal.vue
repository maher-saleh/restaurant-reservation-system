<template>
	<Modal v-if="branch" :disableReservation=true :isOpen="isOpen"
		:title="'Edit ' + branch.name + ' branch reservation settings'" @close="emit('close')" @save="handleSave"
		@confirmed="handleModalDisableReservation">
		<h3
			class="flex mb-6 items-center justify-start h-[50px] px-[10px] border-t border-b border-blue-400 bg-blue-100">
			Branch working hours are {{ branch.opening_from + ' - ' + branch.opening_to }}</h3>

		<!-- reservation duration -->
		<label for="reservationDuration" class="block w-full text-left">Reservation Duration
			(minutes)<span>*</span></label>
		<input type="text" id="reservationDuration" ref="reservationDuration" v-model.number="localReservationDuration"
			class="w-full p-2 mb-6 border border-gray-400 rounded-md">
		<p v-if="errorMessage" class="mb-4 -mt-5 text-sm text-left text-red-600">{{ errorMessage }}</p>

		<!-- tables -->
		<MultiSelect v-if="tableOptions.length > 0" :options="tableOptions" v-model="selectedTables" label="Tables"
			placeholder="Select tables...">

			<template #options="{ toggleSelection }">
				<ul class="py-1">
					<template v-if="props.branch && props.branch.sections">
						<li v-for="section in sections" :key="section.id"
							class="px-4 py-2 text-sm font-bold text-gray-900">
							{{ section.name }}
							<ul class="pl-4">
								<li v-for="(table, index) in section.tables" :key="table.id"
									class="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50"
									:class="{ 'bg-blue-100': isSelected(table) }" role="option"
									:aria-selected="isSelected(table)" tabindex="0"
									@click="toggleSelection(getEnrichedTable(table))"
									@keydown.enter="toggleSelection(getEnrichedTable(table))"
									@keydown.space.prevent="toggleSelection(getEnrichedTable(table))"
									@keydown.arrow-up.prevent="focusPrevious(index, section.tables)"
									@keydown.arrow-down.prevent="focusNext(index, section.tables)">
									{{ table.name }}
								</li>
							</ul>
						</li>
					</template>
					<li v-if="!sections.length" class="px-4 py-2 text-sm text-gray-500" role="option"
						aria-disabled="true" aria-selected="false">
						No tables available
					</li>
				</ul>
			</template>

			<template #selected-item="{ item }">
				{{ item.sectionName || 'Unknown' }} - {{ item.name || 'Unnamed Table' }}
			</template>
		</MultiSelect>

		<!-- time slots -->
		<div v-for="day in sortedDays" :key="day" class="mb-4">
			<TimeSlotInput v-model="reservationTimesByDay[day]" :label="day" @applyToAllDays="applyToAllDays" />
		</div>
	</Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Modal from '@/components/Modals/Modal.vue';
import MultiSelect from '@/components/SelectElement.vue';
import TimeSlotInput from '@/components/Modals/TimeSlotField.vue';

defineOptions({ name: 'EditBranchModal' });

const props = defineProps({
	isOpen: {
		type: Boolean,
		required: true,
	},
	branch: {
		type: Object,
		default: () => ({}),
	},
	inactiveBranches: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['update:inactiveBranches', 'close', 'save', 'disable']);

const sections = computed(() => props.branch?.sections || []);

const tableOptions = computed(() => sections.value.flatMap((section) => {
	const sectionName = typeof section.name === 'string' ? section.name : 'Unknown Section';
	return (section.tables || []).map((table) => ({
		...table,
		sectionName,
		name: typeof table.name === 'string' ? table.name : 'Unnamed Table',
	}));
}));

const getEnrichedTable = (table) => {
	const enriched = tableOptions.value.find((t) => t.id === table.id);
	return enriched || table;
};

const selectedTables = ref([]);

const isSelected = (table) => selectedTables.value.some((item) => item.id === table.id);

const focusPrevious = (currentIndex) => {
	const options = document.querySelectorAll('[role="option"]');
	if (currentIndex > 0) {
		options[currentIndex - 1].focus();
	}
};

const focusNext = (currentIndex, tables) => {
	const options = document.querySelectorAll('[role="option"]');
	if (currentIndex < tables.length - 1) {
		options[currentIndex + 1].focus();
	}
};

const sortedDays = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const previousReservationTimes = ref({});
const reservationTimesByDay = ref({
	saturday: [],
	sunday: [],
	monday: [],
	tuesday: [],
	wednesday: [],
	thursday: [],
	friday: [],
});

const localReservationDuration = ref(props.branch?.reservation_duration || '');

watch(reservationTimesByDay, (newVal) => {
	Object.keys(newVal).forEach((day) => {
		const newStr = JSON.stringify(newVal[day]);
		const oldStr = JSON.stringify(previousReservationTimes.value[day] || []);

		if (newStr !== oldStr) {
			previousReservationTimes.value[day] = JSON.parse(JSON.stringify(newVal[day]));
		}
	});
}, {
	deep: true,
});

watch(
	() => props.branch,
	(newBranch) => {
		if (newBranch) {
			localReservationDuration.value = newBranch.reservation_duration || '';

			if (newBranch.reservation_times) {
				sortedDays.forEach((day) => {
					const times = newBranch.reservation_times[day] || [];
					reservationTimesByDay.value[day] = times.map((time) => [time[0], time[1]]);
					previousReservationTimes.value[day] = JSON.parse(JSON.stringify(reservationTimesByDay.value[day]));
				});
			}
		}
	},
	{ immediate: true },
);

const reservationDuration = ref(null);
const errorMessage = ref('');

const handleSave = () => {
	const duration = localReservationDuration.value;

	if (duration === '' || duration === null || duration === undefined) {
		errorMessage.value = 'Reservation duration is required';
		return;
	}

	const durationNum = typeof duration === 'string' ? Number(duration.trim()) : Number(duration);

	if (Number.isNaN(durationNum)) {
		errorMessage.value = 'Reservation duration must be a valid number';
		return;
	}

	if (durationNum <= 0) {
		errorMessage.value = 'Reservation duration must be greater than 0';
		return;
	}

	errorMessage.value = '';

	const updatedData = {
		reservation_duration: reservationDuration.value?.value || props.branch.reservationDuration,
		reservation_times: reservationTimesByDay.value,
		selected_tables: selectedTables.value,
	};

	emit('save', updatedData);
};

const handleModalDisableReservation = async () => {
	emit('disable', props.branch);
};

const applyToAllDays = (saturdaySlots) => {
	const formattedSlots = saturdaySlots.map((slot) => [
		`${slot.startHour}:${slot.startMinute}`,
		`${slot.endHour}:${slot.endMinute}`,
	]);

	sortedDays.forEach((day) => {
		reservationTimesByDay.value[day] = JSON.parse(JSON.stringify(formattedSlots));
	});
};

</script>

<style scoped>
h1 {
	text-align: left;
}

label span {
	color: red;
	margin-left: 2px;
}
</style>
