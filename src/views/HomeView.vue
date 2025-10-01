<template>
	<div class="home">
		<h1 id="title" class="text-4xl font-bold">Restaurant Reservation System</h1>
		<!-- Modals -->
		<AddBranchesModal :isOpen="isAddBranchesModalOpen" @close="closeModal()" @save="handleAddBranchesSave"
			:inactiveBranches="[...inactiveBranches]" />
		<EditBranchModal :isOpen="isEditBranchModalOpen" @close="closeModal()" @save="handleEditBranchSave"
			:inactiveBranches="[...inactiveBranches]" :branch="selectedBranch" @disable="handleDisableBranch" />
		<!-- Modals -->

		<div class="container flex flex-row items-center justify-between">
			<h2 class="text-xl font-bold">Reservations</h2>
			<button @click="handleDisableReservations"
				class="px-4 py-2 font-semibold text-white transition duration-300 bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700">Disable
				Reservations</button>
		</div>

		<div class="container branches-container">
			<button
				class="inline-flex items-center gap-2 px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
				@click="isAddBranchesModalOpen = true">
				Add Branches
			</button>

			<TableElement :elements="activeBranchesTableCount" @edit-branch="editBranch" />
		</div>
	</div>
</template>

<script setup>
import sendRequest from '@/composables/api';
import {
	ref, onMounted, computed, reactive,
} from 'vue';
import AddBranchesModal from '@/components/Modals/AddBranchesModal.vue';
import EditBranchModal from '@/components/Modals/EditBranchModal.vue';
import TableElement from '@/components/TableElement.vue';

defineOptions({
	name: 'HomeView',
});

const branches = reactive([]);
const isAddBranchesModalOpen = ref(false);
const isEditBranchModalOpen = ref(false);
const activeBranches = computed(() => branches.filter((branch) => branch.accepts_reservations === true));
const inactiveBranches = computed(() => branches.filter((branch) => branch.accepts_reservations === false));
const activeBranchesTableCount = computed(() => activeBranches.value.map((branch) => {
	const tableCount = branch.sections?.reduce((acc, section) => {
		const sectionCount = section.tables?.filter((table) => table.accepts_reservations).length || 0;
		return acc + sectionCount;
	}, 0) || 0;
	return { ...branch, tableCount };
}));
const selectedBranchId = ref(null);
const selectedBranch = computed(() => {
	if (!selectedBranchId.value) return null;
	const branch = branches.find((b) => b.id === selectedBranchId.value);
	return branch ? { ...branch } : null;
});
const editBranch = (branch) => {
	isAddBranchesModalOpen.value = false;
	selectedBranchId.value = branch.id;
	isEditBranchModalOpen.value = true;
};
const closeModal = () => {
	isAddBranchesModalOpen.value = false;
	isEditBranchModalOpen.value = false;
	selectedBranchId.value = null;
};
const generateReference = (branchName) => {
	if (!branchName) return 'BR01';
	const numberMatch = branchName.match(/(\d+)$/);
	const numberPart = numberMatch ? numberMatch[1].padStart(2, '0') : '';
	const nameWithoutNumber = branchName.replace(/\d+$/, '').trim();
	const words = nameWithoutNumber.split(/\s+/);
	const initials = words
		.map((word) => word.charAt(0).toUpperCase())
		.join('');

	return initials + numberPart;
};
const handleEditBranchSave = async (data) => {
	if (selectedBranchId.value) {
		const branchIndex = branches.findIndex((b) => b.id === selectedBranchId.value);
		if (branchIndex !== -1) {
			const payload = {
				...branches[branchIndex],
				reference: branches[branchIndex].reference || generateReference(branches[branchIndex].name),
				reservation_duration: data.reservation_duration,
				reservation_times: data.reservation_times,
				sections: branches[branchIndex].sections?.map((section) => ({
					...section,
					tables: section.tables?.map((table) => ({
						...table,
						accepts_reservations: data.selected_tables.some((t) => t.id === table.id),
					})),
				})),
			};

			try {
				const response = await sendRequest(
					`/api/branches/${branches[branchIndex].id}`,
					'PUT',
					payload,
				);

				branches[branchIndex] = {
					...branches[branchIndex],
					...response,
					sections: response.sections || branches[branchIndex].sections,
				};

				if (branches[branchIndex].sections) {
					branches[branchIndex].sections = branches[branchIndex].sections.map((section) => ({
						...section,
						tables: section.tables?.map((table) => ({
							...table,
							accepts_reservations: data.selected_tables.some((t) => t.id === table.id),
						})),
					}));
				}
			} catch (error) {
				console.error('API Error:', error);
			}
		}
	}
	closeModal();
};

onMounted(async () => {
	if (branches.length <= 0) {
		const data = await sendRequest('/api/branches?include[0]=sections&include[1]=sections.tables', 'GET');
		branches.splice(0, branches.length, ...data);
	}
});

const handleAddBranchesSave = (data) => {
	data.selectedBranches.forEach((branch) => {
		const branchIndex = branches.findIndex((b) => b.id === branch.id);
		if (branchIndex !== -1) {
			branches[branchIndex].accepts_reservations = true;
			sendRequest(`/api/branches/${branches[branchIndex].id}`, 'PUT', { accepts_reservations: true });
		}
	});

	closeModal();
};

const handleDisableReservations = () => {
	activeBranches.value.forEach((branch) => {
		const branchIndex = branches.findIndex((b) => b.id === branch.id);
		if (branchIndex !== -1) {
			branches[branchIndex].accepts_reservations = false;
			sendRequest(`/api/branches/${branches[branchIndex].id}`, 'PUT', { accepts_reservations: false });
		}
	});
};

const handleDisableBranch = (branch) => {
	sendRequest(`/api/branches/${branch.id}`, 'PUT', { accepts_reservations: false });
	const index = branches.findIndex((b) => b.id === branch.id);
	if (index !== -1) {
		branches[index].accepts_reservations = false;
	}
	closeModal();
};
</script>

<style scoped>
h1:not(#title) {
	text-align: left;
}
</style>
