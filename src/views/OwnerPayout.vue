<template>
  <DashboardLayout>
    <!-- Loading Overlay -->
    <div
      v-if="isProcessing"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-8 shadow-xl text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
        <p class="text-lg font-semibold text-gray-800">Processing Withdrawal...</p>
        <p class="text-sm text-gray-600 mt-2">Please wait</p>
      </div>
    </div>

    <div class="p-6 space-y-6">

      <!-- Header -->
      <!-- <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-gray-800">Owner Payout</h2>
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          @click="downloadCurrentPayout"
        >
          Download Current Payout Bill
        </button>
      </div> -->

      <!-- Earnings Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Total Earnings</p>
          <p class="text-3xl font-bold text-green-600">RM {{ totalEarnings.toFixed(2) }}</p>
        </div>
        <!-- <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Withdrawable Amount</p>
          <p class="text-3xl font-bold text-blue-600">RM {{ withdrawable.toFixed(2) }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Pending Transactions</p>
          <p class="text-3xl font-bold text-yellow-600">{{ pendingTransactions }}</p>
        </div> -->
      </div>

      <!-- Withdraw Section -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Withdraw Funds</h3>
        <div class="flex items-center gap-4">
          <input
            type="number"
            v-model.number="withdrawAmount"
            class="border border-gray-300 rounded-lg px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter amount"
          />
          <button
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            @click="withdrawFunds"
            :disabled="isProcessing || withdrawAmount <= 0 || withdrawAmount > withdrawable"
          >
            {{ isProcessing ? 'Processing...' : 'Withdraw' }}
          </button>
        </div>
        <p v-if="withdrawMessage" class="mt-3 text-sm text-gray-600">{{ withdrawMessage }}</p>
      </div>

      <!-- Income Breakdown
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Income Breakdown</h3>
        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4">Machine ID</th>
              <th class="py-2 px-4">Description</th>
              <th class="py-2 px-4 text-right">Amount (RM)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in breakdown" :key="item.id" class="border-b">
              <td class="py-2 px-4">{{ item.machineId }}</td>
              <td class="py-2 px-4">{{ item.description }}</td>
              <td class="py-2 px-4 text-right">{{ item.amount.toFixed(2) }}</td>
            </tr>
            <tr class="font-semibold">
              <td colspan="2" class="py-2 px-4 text-right">Total</td>
              <td class="py-2 px-4 text-right">
                RM {{ breakdown.reduce((t, i) => t + i.amount, 0).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->

      <!-- Transaction History -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Transaction History</h3>

        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4">Date</th>
              <th class="py-2 px-4">Transaction ID</th>
              <th class="py-2 px-4 text-right">Amount (RM)</th>
              <th class="py-2 px-4 text-right">Status</th>
              <!-- <th class="py-2 px-4 text-right">Action</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tx, index) in paginatedTransactions" :key="index" class="border-b">
              <td class="py-2 px-4">{{ tx.date }}</td>
              <td class="py-2 px-4">{{ tx.transactionId }}</td>
              <td class="py-2 px-4 text-right">{{ tx.amount.toFixed(2) }}</td>
              <td class="py-2 px-4 text-right">
                <span
                  :class="tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'"
                >
                  {{ tx.status }}
                </span>
              </td>
              <!-- <td class="py-2 px-4 text-right">
                <button
                  class="text-blue-600 hover:underline"
                  @click="downloadTransaction(tx.transactionId)"
                >
                  Download
                </button>
              </td> -->
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4">
          <p class="text-sm text-gray-600">
            Showing {{ startItem + 1 }}–{{ endItem }} of {{ transactions.length }} results
          </p>
          <div class="space-x-2">
            <button
              class="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </button>
            <button
              class="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              :disabled="endItem >= transactions.length"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/layouts/dashboard_template.vue";
import { ref, computed, onMounted } from "vue";
import api from '@/lib/apiClient'
// Summary Data
const totalEarnings = ref(2800.75);
const withdrawable = ref(1500.25);
const pendingTransactions = ref(3);

// Withdraw Section
const withdrawAmount = ref(0);
const withdrawMessage = ref("");
const isProcessing = ref(false);

const withdrawFunds = async () => {
  if (withdrawAmount.value <= 0 || isProcessing.value) return;

  isProcessing.value = true;
  withdrawMessage.value = "";

  try {
    // Build the request body to match PayoutRequest on the backend
    const payload = {
      amount: withdrawAmount.value,
      // add other fields if PayoutRequest needs them
    };

    const { data } = await api.post('/api/machineowner/payout', payload);

    if (data?.success) {
      withdrawMessage.value = `Withdrawal request of RM ${withdrawAmount.value.toFixed(
        2
      )} submitted successfully.`;

      // reset input
      withdrawAmount.value = 0;

      // refresh totals from backend
      await fetchOwnerTotalTransaction();
      await fetchOwnerWithdrawalHistory();
    } else {
      withdrawMessage.value =
        data?.error ?? 'Unable to submit withdrawal request.';
    }
  } catch (err) {
    withdrawMessage.value =
      err?.response?.data?.error ??
      'Something went wrong while submitting the withdrawal.';
  } finally {
    isProcessing.value = false;
  }
};
const formatDate = (isoString) => {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const year = d.getFullYear();
  return `${day}-${month}-${year}`; // dd-MM-yyyy
};
const fetchOwnerTotalTransaction = async () => {
  const res = await api.get('/api/owner/total-transaction');
  totalEarnings.value = res.data.pointsAwarded;
};
const fetchOwnerWithdrawalHistory = async () => {
  const res = await api.get('/api/owner/withdrawal/get-withdrawal-history');

  // if backend returns the array directly
  const list = res.data;

  transactions.value = list.map((item) => ({
    date: formatDate(item.createdAt), // "2025-11-26"
    transactionId: item.id,
    amount: Number(item.amount),
    status:
      item.status === 'SUCCESS'
        ? 'Completed'
        : item.status === 'IN PROGRESS'
        ? 'Pending'
        : item.status,
  }));
};
onMounted(async () => {
  fetchOwnerTotalTransaction();
  fetchOwnerWithdrawalHistory();
});
// Income Breakdown
const breakdown = ref([
  { id: 1, machineId: "GH-001", description: "Oil Collection - Machine 1", amount: 600.0 },
  { id: 2, machineId: "GH-002", description: "Oil Collection - Machine 2", amount: 750.25 },
  { id: 3, machineId: "GH-003", description: "Recycled Waste Bonus", amount: 150.5 },
]);

// Transaction History
const transactions = ref([
  { date: "2025-09-01", transactionId: "TX-1001", amount: 400.0, status: "Completed" },
  { date: "2025-09-15", transactionId: "TX-1002", amount: 250.25, status: "Pending" },
  { date: "2025-10-01", transactionId: "TX-1003", amount: 500.0, status: "Completed" },
  { date: "2025-10-20", transactionId: "TX-1004", amount: 300.5, status: "Completed" },
  { date: "2025-11-01", transactionId: "TX-1005", amount: 275.0, status: "Pending" },
  { date: "2025-11-03", transactionId: "TX-1006", amount: 180.0, status: "Completed" },
]);

// Pagination
const itemsPerPage = 5;
const currentPage = ref(1);
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return transactions.value.slice(start, end);
});
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage);
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, transactions.value.length));

// Downloads
const downloadCurrentPayout = () => {
  alert("Downloading current payout bill...");
};
const downloadTransaction = (id) => {
  alert(`Downloading transaction statement: ${id}`);
};
</script>
