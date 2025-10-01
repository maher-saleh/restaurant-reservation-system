<template>
	<div class="relative w-full max-w-md">
		<!-- Label for accessibility -->
		<h1>{{ label || 'Select options' }}</h1>

		<!-- Input field with badges -->
		<div class="flex items-center w-full p-2 mb-6 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
			tabindex="0" role="button" :aria-expanded="isOpen" @click="toggleDropdown" @keydown.enter="toggleDropdown"
			@keydown.space.prevent="toggleDropdown">
			<div class="flex flex-wrap flex-1 gap-1">
				<!-- Selected items as badges -->
				<span v-for="item in selectedItems" :key="item.id"
					class="inline-flex items-center px-4 py-2 text-sm text-blue-800 bg-blue-100 rounded-full">
					<slot name="selected-item" :item="item" :display-value="getDisplayValue(item)">
						{{ getDisplayValue(item) }}
					</slot>
					<button type="button" class="ml-1 text-blue-600 hover:text-blue-800"
						:aria-label="`Remove ${getDisplayValue(item)}`" @click.stop="removeItem(item)"
						@keydown.enter.stop="removeItem(item)" @keydown.space.prevent.stop="removeItem(item)">
						&times;
					</button>
				</span>
				<!-- Input (for display only) -->
				<label :for="inputId" class="sr-only">{{ label || 'Select options' }}</label>
				<input :id="inputId" type="text" readonly
					class="flex-1 hidden bg-transparent outline-none cursor-pointer" :placeholder="placeholder"
					aria-describedby="multiselect-instructions" :value="selectedItems.length ? '' : null" />
			</div>
			<!-- Dropdown arrow -->
			<svg class="w-5 h-5 text-gray-500" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor"
				viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</div>

		<!-- Dropdown menu -->
		<div v-if="isOpen"
			class="relative z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
			role="listbox" :aria-multiselectable="maxSelections !== 1">
			<ul class="py-1">
				<slot name="options" :options="optionsData" :toggle-selection="toggleSelection">
					<li v-for="(option, index) in optionsData" :key="option.id || index"
						class="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50"
						:class="{ 'bg-blue-100': isSelected(option) }" role="option" :aria-selected="isSelected(option)"
						tabindex="0" @click="toggleSelection(option)" @keydown.enter="toggleSelection(option)"
						@keydown.space.prevent="toggleSelection(option)"
						@keydown.arrow-up.prevent="focusPrevious(index)" @keydown.arrow-down.prevent="focusNext(index)">
						<slot name="option" :option="option" :display-value="getDisplayValue(option)">
							{{ getDisplayValue(option) }}
						</slot>
					</li>
					<li v-if="!optionsData.length" class="px-4 py-2 text-sm text-gray-500" role="option"
						aria-disabled="true" aria-selected="false">
						No options available
					</li>
				</slot>
			</ul>
		</div>
	</div>
</template>

<script setup>
import {
	ref, computed, onMounted, onUnmounted,
	watch,
} from 'vue';

const props = defineProps({
	options: {
		type: [Object, Array],
		default: () => ({ data: [] }),
		validator: (options) => {
			if (Array.isArray(options)) {
				return options.every((item) => item && (typeof item.id === 'string' || item.id === undefined));
			}
			return options && Array.isArray(options.data);
		},
	},
	modelValue: {
		type: Array,
		default: () => [],
	},
	displayKey: {
		type: [String, Function],
		default: 'name',
	},
	label: {
		type: String,
		default: 'Select options',
	},
	placeholder: {
		type: String,
		default: 'Select...',
	},
	maxSelections: {
		type: Number,
		default: Infinity,
	},
	inputId: {
		type: String,
		default: 'multiselect-input',
	},
});

const emit = defineEmits(['update:modelValue']);
const selectedItems = ref([...props.modelValue]);
const isOpen = ref(false);
const optionsData = computed(() => {
	if (Array.isArray(props.options)) {
		return props.options;
	}
	return props.options?.data || [];
});

const isSelected = computed(() => (option) => selectedItems.value.some((item) => item.id === option.id));

const getDisplayValue = (option) => {
	if (typeof props.displayKey === 'function') {
		return props.displayKey(option);
	}
	return option[props.displayKey] || 'Unnamed';
};

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
	if (isOpen.value) {
		setTimeout(() => {
			const firstOption = document.querySelector('[role="option"]');
			if (firstOption) firstOption.focus();
		}, 0);
	}
};

const toggleSelection = (option) => {
	if (props.maxSelections === 1) {
		selectedItems.value = [option];
	} else {
		const index = selectedItems.value.findIndex((item) => item.id === option.id);
		if (index === -1) {
			if (selectedItems.value.length < props.maxSelections) {
				selectedItems.value.push(option);
			}
		} else {
			selectedItems.value.splice(index, 1);
		}
	}
	emit('update:modelValue', selectedItems.value);
};

const removeItem = (item) => {
	selectedItems.value = selectedItems.value.filter((selected) => selected.id !== item.id);
	emit('update:modelValue', selectedItems.value);
};

const focusPrevious = (currentIndex) => {
	const options = document.querySelectorAll('[role="option"]');
	if (currentIndex > 0) {
		options[currentIndex - 1].focus();
	}
};

const focusNext = (currentIndex) => {
	const options = document.querySelectorAll('[role="option"]');
	if (currentIndex < options.length - 1) {
		options[currentIndex + 1].focus();
	}
};

const closeDropdown = (event) => {
	if (!event.target.closest('.relative')) {
		isOpen.value = false;
	}
};

onMounted(() => {
	window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
	window.removeEventListener('click', closeDropdown);
});

watch(
	() => props.modelValue,
	(newVal) => {
		selectedItems.value = [...newVal];
	},
	{ deep: true },
);
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

h1 {
	text-align: left;
}
</style>
