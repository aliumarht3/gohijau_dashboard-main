<template>
  <DashboardLayout>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Physical Check History</h1>
        <p class="text-base text-gray-600 mt-1">Review manual hardware diagnostic reports submitted by technicians.</p>
      </div>
      
      <div class="flex gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm font-bold text-gray-700">Select Machine:</label>
          <select 
            v-model="selectedMachine" 
            class="bg-white border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2 font-medium shadow-sm cursor-pointer"
          >
            <option v-for="machine in machines" :key="machine.id" :value="machine.id">
              {{ machine.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></span>
      <span class="ml-3 text-gray-600 font-bold">Loading reports...</span>
    </div>

    <div v-else-if="reports.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
      <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      <p class="text-lg font-bold text-gray-700">No physical reports found.</p>
      <p class="text-sm">There are no technician reports submitted for {{ selectedMachine }} yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="report in reports" :key="report.id" class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div class="bg-gray-800 p-4 text-white flex justify-between items-center">
          <span class="font-bold text-sm uppercase tracking-wider">Report Log</span>
          <span class="text-xs font-mono bg-gray-700 px-2 py-1 rounded">{{ new Date(report.timestamp).toLocaleString() }}</span>
        </div>
        
        <div class="p-4">
          <ul class="space-y-3">
            <li v-for="item in report.checks" :key="item.component" class="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
              <span class="font-medium text-gray-700 text-sm">{{ item.component }}</span>
              <span v-if="item.passed" class="flex items-center gap-1 text-green-700 text-xs font-bold bg-green-100 px-2 py-1 rounded">
                PASS
              </span>
              <span v-else class="flex items-center gap-1 text-red-700 text-xs font-bold bg-red-100 px-2 py-1 rounded">
                FAIL
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/lib/apiClient';
import DashboardLayout from '@/layouts/dashboard_template.vue';
import { useUserStore } from '@/stores/userStore'; // 👈 Import the store

// Initialize user store and role
const userStore = useUserStore();

// Initialize as empty
const selectedMachine = ref('');
const machines = ref([]);

const reports = ref([]);
const isLoading = ref(false);

// Fetch the list of machines from the backend dynamically based on role
const fetchMachines = async () => {
  try {
    // 1. Grab the role dynamically 
    const role = userStore.user?.userRole;
    const endpoint = role === 'Owner' ? '/api/machine/owner' : '/api/machine/all';
    
    console.log(`📡 Fetching from: ${endpoint} (User Role: ${role})`);

    const response = await api.get(endpoint); 
    
    // 2. Map the response with fallbacks and location names
    machines.value = response.data.map(m => {
      const safeId = m.machineId || m.id || "Unknown ID";
      const safeLabel = m.location?.name ? `${safeId} - ${m.location.name}` : safeId;
      
      return {
        id: safeId, 
        label: safeLabel
      };
    });

    // 3. Auto-select the first item
    if (machines.value.length > 0) {
      selectedMachine.value = machines.value[0].id;
    } else {
      console.warn("⚠️ No active machines found for this user.");
    }
    
  } catch (error) {
    console.error("❌ Failed to fetch machines list:", error);
  }
};

const fetchReports = async () => {
  // Guard clause: Don't fetch if no machine is selected yet
  if (!selectedMachine.value) return; 

  isLoading.value = true;
  reports.value = [];
  try {
    const response = await api.get(`/api/machine/physical-checks/${selectedMachine.value}`);
    
    // Ensure newest reports appear first
    if(response.data) {
       reports.value = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  } catch (error) {
    console.error("Error fetching physical reports:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  // Fetch machines first when the component loads
  await fetchMachines();
});

// Automatically fetch reports whenever the selected machine changes
watch(selectedMachine, fetchReports);
</script>