<template>
  <DashboardLayout>
    <Card class="mt-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Manufactured Machines</h2>
        <button
          @click="markAsSent"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Mark Selected as Sent
        </button>
      </div>

      <!-- Add Machine IDs -->
      <div class="flex space-x-2 mb-4">
        <input
          v-model="newMachineId"
          type="text"
          placeholder="Enter machine ID"
          class="border rounded px-3 py-2 flex-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          @click="addMachine"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <!-- Machine Table -->
      <div class="overflow-x-auto border rounded-lg shadow-sm">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th class="px-4 py-3 w-10">#</th>
              <th class="px-4 py-3">Machine ID</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-center">Actions</th>
              <th class="px-4 py-3 text-center">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(machine, index) in machineList"
              :key="machine.id"
              class="hover:bg-gray-50 text-sm border-t"
            >
              <td class="px-4 py-2">{{ index + 1 }}</td>
              <td class="px-4 py-2 font-medium">{{ machine.machineId }}</td>
              <td class="px-4 py-2">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-700': machine.status === 'PENDING',
                    'bg-green-100 text-green-700': machine.status === 'SENT'
                  }"
                >
                  {{ machine.status }}
                </span>
              </td>
              <td class="px-4 py-2 text-center space-x-2">
                <button
                  @click="removeMachine(machine)"
                  class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
              <td class="px-4 py-2 text-center">
                <input type="checkbox" v-model="selectedIds" :value="machine.id" />
              </td>
            </tr>

            <tr v-if="machineList.length === 0">
              <td colspan="6" class="text-center py-4 text-gray-500">
                No machines added yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/layouts/dashboard_template.vue";
import Card from "@/components/Card.vue";
import { ref, onMounted } from "vue";
import api from '@/lib/apiClient'

const newMachineId = ref("");
const machineList = ref([]);
const selectedIds = ref([]);
const selectAll = ref(false);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    fetchMachines()
  } catch (err) {
    console.error("Failed to fetch machines:", err);
    error.value = "Could not load machines.";
  } finally {
    loading.value = false;
  }
});

async function fetchMachines() {
  const res = await api.get('/api/manufacturer/all')
  machineList.value = res.data
}

async function addMachine() {
  if (!newMachineId.value.trim()) return;
  try {
    const payload = {
      machineId: newMachineId.value.trim(),
      status: 0,
    };
    const res = await api.post(`/api/manufacturer/create`, payload)
    newMachineId.value = "";
  } catch (err) {
      console.error("Failed to create machine:", err);
      alert(`❌ Failed to create machine.\n\nError: ${err.response?.data?.message || err}`);
  }
  fetchMachines();
}

async function removeMachine(machine) {
  if (confirm("Delete " + machine.machineId + "?")) {
    try {
      await api.delete(`/api/manufacturer/delete/${machine.id}`);
      fetchMachines();
    } catch (err) {
      console.error("Failed to delete machine:", err);
      alert("❌ Failed to delete machine. Please try again.");
    }
  }
}

async function markAsSent() {
  for (const m of selectedIds.value) {
    const payload = { Id: m }; // Adjust fields to match backend expectations

    try {
      await api.put(`/api/manufacturer/sent`, payload);
    } catch (err) {
      console.error(`❌ Failed to update machine ${m.id}:`, err);
      alert(`❌ Failed to update machine.\n\nError: ${err.response?.data?.message || err}`);
    }
  }
  selectedIds.value = [];
  selectAll.value = false;
  fetchMachines();
}

function toggleSelectAll() {
  selectedIds.value = selectAll.value
    ? machineList.value.map((m) => m.id)
    : [];
}
</script>
