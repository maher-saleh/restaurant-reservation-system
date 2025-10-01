<template>
	<h1 class="flex justify-between text-left">
		<span>{{ label.charAt(0).toUpperCase() + label.slice(1) }}</span>
		<button v-if="label == 'saturday'" class="text-blue-600 hover:underline" @click="handleApplyOnAllDays">Apply on all
			days</button>
	</h1>
	<div class="flex justify-between w-full max-w-2xl">
		<div id="time-slots-container" class="flex flex-wrap w-full">
			<div v-for="slot in timeSlots" :key="slot.id"
				class="mr-2 flex items-center h-[42px] relative p-2 transition-colors border-2 rounded-lg"
				:class="editingSlotId === slot.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'">

				<button type="button" @click="removeTimeSlot(slot.id)"
					class="absolute flex items-center justify-center w-6 h-6 text-gray-500 transition-colors rounded-full top-2 right-2 hover:text-red-600 hover:bg-red-50"
					aria-label="Remove time slot">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<div v-if="editingSlotId !== slot.id" @click="startEditing(slot.id)" @keydown.enter="startEditing(slot.id)"
					@keydown.space="startEditing(slot.id)" class="pr-6 text-lg font-medium text-gray-800 cursor-pointer"
					role="button" tabindex="0"
					:aria-label="`Edit time slot ${slot.startHour}:${slot.startMinute} to ${slot.endHour}:${slot.endMinute}`">
					{{ slot.startHour }}:{{ slot.startMinute }} - {{ slot.endHour }}:{{ slot.endMinute }}
				</div>

				<div v-else class="flex items-center gap-0 pr-6">
					<label :for="`start-hour-${slot.id}`" class="sr-only">Start hour</label>
					<input :id="`start-hour-${slot.id}`" v-model="slot.startHour" @blur="validateAndFormat(slot, 'startHour')"
						@keydown.enter="stopEditing" @keydown.esc="stopEditing" type="text" maxlength="2"
						class="w-8 text-lg font-medium text-center border-2 border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="00" aria-label="Start hour" />
					<span class="text-lg font-bold text-gray-600">:</span>

					<label :for="`start-minute-${slot.id}`" class="sr-only">Start minute</label>
					<input :id="`start-minute-${slot.id}`" v-model="slot.startMinute"
						@blur="validateAndFormat(slot, 'startMinute')" @keydown.enter="stopEditing" @keydown.esc="stopEditing"
						type="text" maxlength="2"
						class="w-8 text-lg font-medium text-center border-2 border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="00" aria-label="Start minute" />
					<span class="mx-0 text-lg font-bold text-gray-600">-</span>

					<label :for="`end-hour-${slot.id}`" class="sr-only">End hour</label>
					<input :id="`end-hour-${slot.id}`" v-model="slot.endHour" @blur="validateAndFormat(slot, 'endHour')"
						@keydown.enter="stopEditing" @keydown.esc="stopEditing" type="text" maxlength="2"
						class="w-8 text-lg font-medium text-center border-2 border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="00" aria-label="End hour" />
					<span class="text-lg font-bold text-gray-600">:</span>

					<label :for="`end-minute-${slot.id}`" class="sr-only">End minute</label>
					<input :id="`end-minute-${slot.id}`" v-model="slot.endMinute" @blur="validateAndFormat(slot, 'endMinute')"
						@keydown.enter="stopEditing" @keydown.esc="stopEditing" type="text" maxlength="2"
						class="w-8 text-lg font-medium text-center border-2 border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="00" aria-label="End minute" />
					<button type="button" @click="stopEditing"
						class="px-3 py-1 ml-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
						Done
					</button>
				</div>
			</div>

			<div v-if="timeSlots.length === 0" class="self-center text-center text-gray-500">
				Add available reservation times
			</div>
		</div>
		<div class="flex flex-wrap items-center justify-between h-[42px]">
			<button :class="{ 'opacity-50 cursor-not-allowed': timeSlots.length >= 3 }" type="button" @click="addTimeSlot"
				class="h-[40px] flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				aria-label="Add new time slot">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
			</button>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	watch,
} from 'vue';

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => [],
	},
	label: {
		type: String,
		default: 'Time Slots',
	},
});

const emit = defineEmits(['update:modelValue', 'applyToAllDays']);

const timeSlots = ref([]);
const editingSlotId = ref(null);
let nextId = 1;
let isInternalUpdate = false;

const startEditing = (id) => {
	editingSlotId.value = id;
};

const stopEditing = () => {
	editingSlotId.value = null;
};

const validateAndFormat = (slot, field) => {
	let value = parseInt(slot[field], 10) || 0;
	if (field === 'startHour' || field === 'endHour') {
		value = Math.max(0, Math.min(23, value));
	} else if (field === 'startMinute' || field === 'endMinute') {
		value = Math.max(0, Math.min(59, value));
	}

	const index = timeSlots.value.findIndex((s) => s.id === slot.id);
	if (index !== -1) {
		timeSlots.value[index] = {
			...slot,
			[field]: value.toString().padStart(2, '0'),
		};
	}
};

watch(() => props.modelValue, (newVal) => {
	if (isInternalUpdate) {
		isInternalUpdate = false;
		return;
	}

	if (newVal && newVal.length > 0) {
		timeSlots.value = newVal.map((slot, index) => {
			if (!Array.isArray(slot) || slot.length !== 2) {
				console.warn('Invalid slot format:', slot);
				return {
					id: index + 1,
					startHour: '00',
					startMinute: '00',
					endHour: '00',
					endMinute: '00',
				};
			}

			const [start, end] = slot;
			const startParts = start.split(':');
			const endParts = end.split(':');

			return {
				id: index + 1,
				startHour: startParts[0] || '00',
				startMinute: startParts[1] || '00',
				endHour: endParts[0] || '00',
				endMinute: endParts[1] || '00',
			};
		});
		nextId = timeSlots.value.length + 1;
	} else if (!newVal || newVal.length === 0) {
		timeSlots.value = [];
		nextId = 1;
	}
}, {
	immediate: true,
	deep: true,
});

watch(timeSlots, (newSlots) => {
	const formatted = newSlots.map((slot) => [
		`${slot.startHour}:${slot.startMinute}`,
		`${slot.endHour}:${slot.endMinute}`,
	]);

	isInternalUpdate = true;
	emit('update:modelValue', formatted);
}, {
	deep: true,
});

const addTimeSlot = () => {
	if (timeSlots.value.length >= 3) return;

	const newSlot = {
		id: nextId,
		startHour: '00',
		startMinute: '00',
		endHour: '00',
		endMinute: '00',
	};
	nextId += 1;
	timeSlots.value.push(newSlot);
	startEditing(newSlot.id);
};

const removeTimeSlot = (id) => {
	if (editingSlotId.value) {
		stopEditing();
		return;
	}
	timeSlots.value = timeSlots.value.filter((slot) => slot.id !== id);
	if (editingSlotId.value === id) {
		editingSlotId.value = null;
	}
};

const handleApplyOnAllDays = () => {
	emit('applyToAllDays', timeSlots.value);
};

</script>

<style scoped>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
}
</style>
