<template>
	<Modal :isOpen="isOpen" title="Add Branches" @close="handleClose" @save="handleSave">
		<MultiSelect class="justify-self-center" :options="props.inactiveBranches" v-model="selectedBranches"
			placeholder="Select branches..." :max-selections="20" label="Branches" />
	</Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '@/components/Modals/Modal.vue';
import MultiSelect from '@/components/SelectElement.vue';

defineOptions({ name: 'AddBranchesModal' });

const selectedBranches = ref([]);

const props = defineProps({
	inactiveBranches: {
		type: Array,
		required: true,
	},
	isOpen: {
		type: Boolean,
		required: true,
	},
	branch: {
		type: Object,
		default: null,
	},
	fruits: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['update:inactiveBranches', 'close', 'save']);

const handleClose = () => {
	emit('close');
	selectedBranches.value = [];
};

const handleSave = () => {
	emit('save', { selectedBranches: selectedBranches.value });
	selectedBranches.value = [];
};
</script>

<style scoped>
h1 {
	text-align: left;
}
</style>
