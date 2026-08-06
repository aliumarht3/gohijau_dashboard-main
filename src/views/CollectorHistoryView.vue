<template>
  <DashboardLayout>
    <Card class="mt-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Collector History</h2>
      </div>

      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by machine ID, place, or collector..."
            class="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <svg
            class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 font-semibold mb-4">{{ error }}</p>
        <button
          @click="fetchCollectionHistory"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gradient-to-r from-green-50 to-emerald-50 text-left text-sm font-semibold text-gray-700">
              <th class="px-6 py-4">Date & Time</th>
              <th class="px-6 py-4">Machine Place</th>
              <th class="px-6 py-4">Machine ID</th>
              <th class="px-6 py-4">Oil Collected (KG)</th>
              <th class="px-6 py-4">Collector Recorded (KG)</th>
              <th class="px-6 py-4">Collector Rate (RM/KG)</th>
              <th class="px-6 py-4">GoHijau Total (RM)</th>
              <th class="px-6 py-4">Collector Total (RM)</th>
              <th class="px-6 py-4">Collected By</th>
              <th class="px-6 py-4">Difference (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(record, index) in paginatedRecords"
              :key="index"
              class="hover:bg-gray-50 text-sm text-gray-800 border-t transition-colors"
            >
              <td class="px-6 py-4">{{ formatDateTime(record.dateTime) }}</td>
              <td class="px-6 py-4 font-medium">{{ record.machinePlace }}</td>
              <td class="px-6 py-4 font-mono text-xs bg-gray-100 rounded px-2 py-1 inline-block">
                {{ record.machineId }}
              </td>
              <td class="px-6 py-4 font-semibold text-green-600">{{ record.oilCollected }}</td>
              <td class="px-6 py-4 font-semibold text-blue-600">{{ record.collectorRecorded }}</td>
              <td class="px-6 py-4 font-medium text-purple-600">{{ record.collectorRate.toFixed(2) }}</td>
              <td class="px-6 py-4 font-bold text-green-700">
                RM {{ calculateGoHijauTotal(record.oilCollected, record.collectorRate) }}
              </td>
              <td class="px-6 py-4 font-bold text-blue-700">
                RM {{ calculateCollectorTotal(record.collectorRecorded, record.collectorRate) }}
              </td>
              <td class="px-6 py-4">{{ record.collectedBy }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-semibold',
                    getDifferenceClass(record.oilCollected, record.collectorRecorded)
                  ]"
                >
                  {{ calculateDifference(record.oilCollected, record.collectorRecorded) }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredRecords.length === 0">
              <td colspan="10" class="text-center py-8 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-gray-500">No collection records found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredRecords.length > 0" class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <span class="text-sm text-gray-600">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to
          {{ Math.min(currentPage * pageSize, filteredRecords.length) }} of
          {{ filteredRecords.length }} entries
        </span>
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <div class="flex space-x-1">
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 border rounded-md text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <p class="text-sm text-green-700 font-medium">Total Collections</p>
          <p class="text-2xl font-bold text-green-900 mt-1">{{ collectionRecords.length }}</p>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <p class="text-sm text-blue-700 font-medium">Total Oil Collected</p>
          <p class="text-2xl font-bold text-blue-900 mt-1">{{ totalOilCollected.toFixed(2) }} KG</p>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <p class="text-sm text-purple-700 font-medium">Average Per Collection</p>
          <p class="text-2xl font-bold text-purple-900 mt-1">
            {{ collectionRecords.length > 0 ? (totalOilCollected / collectionRecords.length).toFixed(2) : '0.00' }} KG
          </p>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
          <p class="text-sm text-emerald-700 font-medium">Total GoHijau Amount</p>
          <p class="text-2xl font-bold text-emerald-900 mt-1">RM {{ totalGoHijauAmount.toFixed(2) }}</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
          <p class="text-sm text-indigo-700 font-medium">Total Collector Amount</p>
          <p class="text-2xl font-bold text-indigo-900 mt-1">RM {{ totalCollectorAmount.toFixed(2) }}</p>
        </div>
      </div>
    </Card>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '@/layouts/dashboard_template.vue';
import Card from '@/components/Card.vue';
import api from '@/lib/apiClient';

const loading = ref(false);
const error = ref(null);
const collectionRecords = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 10;

// Fetch collection history
onMounted(async () => {
  await fetchCollectionHistory();
});

async function fetchCollectionHistory() {
  loading.value = true;
  error.value = null;
  collectionRecords.value = [];

  try {
    // API call to fetch collector history
    const response = await api.get('/api/collector/history');
    
    if (response.data && Array.isArray(response.data)) {
      collectionRecords.value = response.data.map(item => ({
        dateTime: item.dateTime || item.collectionDate || item.timestamp,
        machinePlace: item.machineName || item.locationName || item.place || 'Unknown Location',
        machineId: item.machineId || item.deviceId || 'N/A',
        oilCollected: parseFloat(item.systemRecorded || item.gohijauRecorded || item.actualAmount || 0),
        collectorRecorded: parseFloat(item.collectorRecorded || item.reportedAmount || item.collectorAmount || 0),
        collectorRate: parseFloat(item.collectorRate || item.rate || item.buyingRate || 2.50),
        collectedBy: item.collectorName || item.collector || item.collectorOrganization || 'Unknown Collector',
      }));
    }

    console.log('✅ Fetched collector history:', collectionRecords.value.length, 'records');
  } catch (err) {
    console.error('❌ Error fetching collector history:', err);
    
    if (err.response?.status === 404) {
      error.value = 'No collection history found.';
    } else if (err.response?.status === 403) {
      error.value = 'You do not have permission to view collection history.';
    } else if (err.response?.status === 500) {
      error.value = 'Server error. Please try again later.';
    } else {
      error.value = err.message || 'Failed to load collection history. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}

// Filtered records based on search
const filteredRecords = computed(() => {
  if (!searchQuery.value) return collectionRecords.value;

  const query = searchQuery.value.toLowerCase();
  return collectionRecords.value.filter(record =>
    record.machinePlace.toLowerCase().includes(query) ||
    record.machineId.toLowerCase().includes(query) ||
    record.collectedBy.toLowerCase().includes(query)
  );
});

// Pagination computed
const totalPages = computed(() => Math.ceil(filteredRecords.value.length / pageSize));

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredRecords.value.slice(start, start + pageSize);
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPages - 1);

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Summary stats
const totalOilCollected = computed(() => {
  return collectionRecords.value.reduce((sum, record) => sum + record.oilCollected, 0);
});

const totalGoHijauAmount = computed(() => {
  return collectionRecords.value.reduce((sum, record) => {
    return sum + (record.oilCollected * record.collectorRate);
  }, 0);
});

const totalCollectorAmount = computed(() => {
  return collectionRecords.value.reduce((sum, record) => {
    return sum + (record.collectorRecorded * record.collectorRate);
  }, 0);
});

// Pagination functions
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPage(page) {
  currentPage.value = page;
}

// Format date time to 12-hour format with AM/PM
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
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, '0');

  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
}

// Calculate GoHijau Total
function calculateGoHijauTotal(oilCollected, collectorRate) {
  return (oilCollected * collectorRate).toFixed(2);
}

// Calculate Collector Total
function calculateCollectorTotal(collectorRecorded, collectorRate) {
  return (collectorRecorded * collectorRate).toFixed(2);
}

// Calculate difference
function calculateDifference(systemRecorded, collectorRecorded) {
  const diff = systemRecorded - collectorRecorded;
  return diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
}

// Get difference CSS class
function getDifferenceClass(systemRecorded, collectorRecorded) {
  const diff = Math.abs(systemRecorded - collectorRecorded);
  if (diff < 0.5) return 'bg-green-100 text-green-700';
  if (diff < 2) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}
</script>
