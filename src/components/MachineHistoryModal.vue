<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-white">Machine History</h2>
          <p class="text-sm text-green-100 mt-1">{{ machine?.name }} - {{ machine?.deviceId }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 px-6 pt-4">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'deposition'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'deposition'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Oil Deposition History
          </button>
          <button
            @click="activeTab = 'collection'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'collection'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            UCO Collection History
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-600 font-semibold">{{ error }}</p>
        </div>

        <!-- Tab Content -->
        <template v-else>
          <!-- Oil Deposition History Tab -->
          <div v-show="activeTab === 'deposition'">
            <div class="mb-4 flex justify-between items-center">
              <p class="text-sm text-gray-600">Total Deposits: {{ depositionHistory.length }}</p>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount (KG)</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deposited User</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Reward (RM)</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner Reward (RM)</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(deposit, index) in paginatedDepositions" :key="index" class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-3 text-sm text-gray-900">{{ formatDateTime(deposit.dateTime) }}</td>
                      <td class="px-4 py-3 text-sm font-semibold text-gray-900">{{ deposit.amount }}</td>
                      <td class="px-4 py-3 text-sm text-gray-700">{{ deposit.user }}</td>
                      <td class="px-4 py-3 text-sm text-green-600 font-medium">{{ deposit.customerReward.toFixed(2) }}</td>
                      <td class="px-4 py-3 text-sm text-blue-600 font-medium">{{ deposit.ownerReward.toFixed(2) }}</td>
                    </tr>
                    <tr v-if="depositionHistory.length === 0">
                      <td colspan="5" class="px-4 py-8 text-center text-gray-500 text-sm">
                        No deposition history found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination for Deposition -->
            <div v-if="depositionHistory.length > 0" class="flex justify-between items-center mt-4">
              <span class="text-sm text-gray-600">
                Showing {{ (depositionPage - 1) * pageSize + 1 }} to {{ Math.min(depositionPage * pageSize, depositionHistory.length) }} of {{ depositionHistory.length }} entries
              </span>
              <div class="space-x-2">
                <button
                  @click="depositionPage--"
                  :disabled="depositionPage === 1"
                  class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span class="px-3 py-1 text-sm text-gray-600">
                  Page {{ depositionPage }} of {{ totalDepositionPages }}
                </span>
                <button
                  @click="depositionPage++"
                  :disabled="depositionPage === totalDepositionPages"
                  class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <!-- UCO Collection History Tab -->
          <div v-show="activeTab === 'collection'">
            <div class="mb-4 flex justify-between items-center">
              <p class="text-sm text-gray-600">Total Collections: {{ collectionHistory.length }}</p>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                      <th v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Collector</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GoHijau Recorded (KG)</th>
                      <th v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Collector Recorded (KG)</th>
                      <th v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Difference</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(collection, index) in paginatedCollections" :key="index" class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-3 text-sm text-gray-900">{{ formatDateTime(collection.dateTime) }}</td>
                      <td v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'" class="px-4 py-3 text-sm text-gray-700">{{ collection.collector }}</td>
                      <td class="px-4 py-3 text-sm font-semibold text-gray-900">{{ collection.gohijauRecorded }}</td>
                      <td v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'" class="px-4 py-3 text-sm font-semibold text-gray-900">{{ collection.collectorRecorded }}</td>
                      <td v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'" class="px-4 py-3 text-sm">
                        <span
                          :class="[
                            'px-2 py-1 rounded text-xs font-semibold',
                            getDifferenceClass(collection.gohijauRecorded, collection.collectorRecorded)
                          ]"
                        >
                          {{ calculateDifference(collection.gohijauRecorded, collection.collectorRecorded) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="collectionHistory.length === 0">
                      <td :colspan="userRole === 'Admin' || userRole === 'GoHijauOwner' ? 5 : 2" class="px-4 py-8 text-center text-gray-500 text-sm">
                        No collection history found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination for Collection -->
            <div v-if="collectionHistory.length > 0" class="flex justify-between items-center mt-4">
              <span class="text-sm text-gray-600">
                Showing {{ (collectionPage - 1) * pageSize + 1 }} to {{ Math.min(collectionPage * pageSize, collectionHistory.length) }} of {{ collectionHistory.length }} entries
              </span>
              <div class="space-x-2">
                <button
                  @click="collectionPage--"
                  :disabled="collectionPage === 1"
                  class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span class="px-3 py-1 text-sm text-gray-600">
                  Page {{ collectionPage }} of {{ totalCollectionPages }}
                </span>
                <button
                  @click="collectionPage++"
                  :disabled="collectionPage === totalCollectionPages"
                  class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p class="text-sm text-blue-700 font-medium">Total Deposited</p>
              <p class="text-2xl font-bold text-blue-900 mt-1">
                {{ totalDeposited.toFixed(2) }} KG
              </p>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p class="text-sm text-green-700 font-medium">Total Collected</p>
              <p class="text-2xl font-bold text-green-900 mt-1">
                {{ totalCollected.toFixed(2) }} KG
              </p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p class="text-sm text-purple-700 font-medium">Total Rewards Paid</p>
              <p class="text-2xl font-bold text-purple-900 mt-1">
                RM {{ totalRewards.toFixed(2) }}
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '@/lib/apiClient';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const userRole = userStore.user?.userRole;

const props = defineProps({
  show: { type: Boolean, required: true },
  machine: { type: Object, default: null },
});

const loading = ref(false);
const error = ref(null);
const depositionHistory = ref([]);
const collectionHistory = ref([]);
const activeTab = ref('deposition');

const pageSize = 10;
const depositionPage = ref(1);
const collectionPage = ref(1);

const totalDepositionPages = computed(() => {
  return Math.ceil(depositionHistory.value.length / pageSize);
});

const totalCollectionPages = computed(() => {
  return Math.ceil(collectionHistory.value.length / pageSize);
});

const paginatedDepositions = computed(() => {
  const start = (depositionPage.value - 1) * pageSize;
  return depositionHistory.value.slice(start, start + pageSize);
});

const paginatedCollections = computed(() => {
  const start = (collectionPage.value - 1) * pageSize;
  return collectionHistory.value.slice(start, start + pageSize);
});

const totalDeposited = computed(() => {
  return depositionHistory.value.reduce((sum, d) => sum + parseFloat(d.amount), 0);
});

const totalCollected = computed(() => {
  return collectionHistory.value.reduce((sum, c) => sum + parseFloat(c.gohijauRecorded), 0);
});

const totalRewards = computed(() => {
  const customerRewards = depositionHistory.value.reduce((sum, d) => sum + d.customerReward, 0);
  const ownerRewards = depositionHistory.value.reduce((sum, d) => sum + d.ownerReward, 0);
  return customerRewards + ownerRewards;
});

watch(() => props.show, (newVal) => {
  if (newVal && props.machine) {
    activeTab.value = 'deposition';
    depositionPage.value = 1;
    collectionPage.value = 1;
    fetchMachineHistory();
  }
});

async function fetchMachineHistory() {
  if (!props.machine?.machineId) return;

  loading.value = true;
  error.value = null;
  depositionHistory.value = [];
  collectionHistory.value = [];

  try {
    // Fetch deposition history
    const depositionRes = await api.get(`/api/machine/${props.machine.machineId}/deposition-history`);
    
    // Map the response to the expected format
    if (depositionRes.data && Array.isArray(depositionRes.data)) {
      depositionHistory.value = depositionRes.data.map(item => ({
        dateTime: item.dateTime || item.createdAt || item.timestamp,
        amount: item.amount || item.quantity || '0',
        user: item.userName || item.user || item.customerName || 'Unknown User',
        customerReward: parseFloat(item.customerReward || item.userReward || 0),
        ownerReward: parseFloat(item.ownerReward || item.machineOwnerReward || 0),
      }));
    }

 
    const collectionRes = await api.get(`/api/machine/${props.machine.machineId}/collection-history`);
    
 
    if (collectionRes.data && Array.isArray(collectionRes.data)) {
      collectionHistory.value = collectionRes.data.map(item => ({
        dateTime: item.dateTime || item.collectionDate || item.timestamp,
        collector: item.collectorName || item.collector || item.collectorOrganization || 'Unknown Collector',
        gohijauRecorded: item.systemRecorded || item.gohijauRecorded || item.actualAmount || '0',
        collectorRecorded: item.collectorRecorded || item.reportedAmount || item.collectorAmount || '0',
      }));
    }

    console.log('✅ Fetched machine history:', {
      depositions: depositionHistory.value.length,
      collections: collectionHistory.value.length
    });

  } catch (err) {
    console.error('❌ Error fetching machine history:', err);
    
    if (err.response?.status === 404) {
      error.value = 'No history found for this machine.';
    } else if (err.response?.status === 403) {
      error.value = 'You do not have permission to view this machine\'s history.';
    } else if (err.response?.status === 500) {
      error.value = 'Server error. Please try again later.';
    } else {
      error.value = err.message || 'Failed to load machine history. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, '0');
  
  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
}

// Calculate difference between recordings
function calculateDifference(gohijau, collector) {
  const diff = parseFloat(gohijau) - parseFloat(collector);
  return diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
}

// Get CSS class for difference
function getDifferenceClass(gohijau, collector) {
  const diff = parseFloat(gohijau) - parseFloat(collector);
  if (Math.abs(diff) < 0.5) return 'bg-green-100 text-green-700';
  if (Math.abs(diff) < 2) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}
</script>
