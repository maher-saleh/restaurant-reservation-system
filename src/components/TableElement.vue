<template>
	<table class="w-full border border-gray-300 table-auto md:table-fixed">
		<thead>
			<tr class="bg-gray-200">
				<th class="w-1/4 px-2 py-3 border">Branch</th>
				<th class="w-1/4 px-2 py-3 border">Reference</th>
				<th class="w-1/4 px-2 py-3 border">Number of Tables</th>
				<th class="w-1/4 px-2 py-3 border">Reservation Duration</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="element in elements" :key="element.id"
				class="cursor-pointer hover:bg-gray-100 odd:bg-white even:bg-gray-50" @click="editBranch(element)">
				<td class="py-3">{{ element.name }}</td>
				<td class="py-3">{{ element.reference }}</td>
				<td class="py-3">{{ element.tableCount }}</td>
				<td class="py-3">{{ element.reservation_duration }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup>
defineProps({
	elements: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits(['edit-branch']);

const editBranch = (branch) => {
	emit('edit-branch', branch);
};
</script>
