<template>
	<div v-if="isOpen"
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
		<div class="container w-full max-w-xl p-6 mx-4 bg-white rounded-lg shadow-lg">
			<!-- Modal Header -->
			<h2 class="mb-4 text-xl font-bold font-Roboto">{{ title }}</h2>

			<!-- Modal Content -->
			<div class="mb-4 max-h-[70vh] overflow-auto">
				<slot>Default modal content</slot>
			</div>

			<!-- Modal Actions -->
			<div>
				<button v-if="disableReservation" class="text-blue-600 hover:underline"
					@click="handleConfirmation">Disable reservation</button>
				<div class="flex justify-end space-x-2">
					<button @click.stop="$emit('close')"
						class="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400 font-Roboto">
						Close
					</button>
					<button @click.stop="$emit('save')"
						class="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600 font-Roboto">
						Save
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
defineOptions({
	name: 'Modal',
});

defineProps({
	isOpen: {
		type: Boolean,
		required: true,
	},
	title: {
		type: String,
		default: 'Modal Title',
	},
	disableReservation: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['close', 'save', 'confirmed']);

const handleConfirmation = () => {
	emit('confirmed');
};
</script>

<style scoped>
h2 {
	border-bottom: 1px solid lightgray;
	padding-bottom: 15px;
}
</style>
