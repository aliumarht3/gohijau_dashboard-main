<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">

      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-gray-800">Collector Billing</h2>
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          @click="payNow"
        >
          Pay Now
        </button>
      </div>

      <!-- Blacklist Banner -->
      <div
        v-if="credit <= 0"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
      >
        <strong class="font-bold">⚠ Blacklisted!</strong>
        <span class="block sm:inline">
          Your credit has been fully deducted. Please settle all outstanding
          payments to remove blacklist status.
        </span>
      </div>

      <!-- Billing Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Credit Amount</p>
          <p class="text-3xl font-bold text-green-600">RM {{ credit.toFixed(2) }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Current Bill</p>
          <p class="text-3xl font-bold text-yellow-600">RM {{ currentBill.toFixed(2) }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">Overdue Amount</p>
          <p class="text-3xl font-bold text-red-600">RM {{ overdue.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Bill Breakdown -->
      <!-- <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Price Breakdown</h3>
        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 font-medium">Description</th>
              <th class="py-2 px-4 font-medium text-right">Amount (RM)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in billItems" :key="item.id" class="border-b">
              <td class="py-2 px-4">{{ item.description }}</td>
              <td class="py-2 px-4 text-right">{{ item.amount.toFixed(2) }}</td>
            </tr>
            <tr class="font-semibold">
              <td class="py-2 px-4 text-right">Total</td>
              <td class="py-2 px-4 text-right">
                RM {{ billItems.reduce((t, i) => t + i.amount, 0).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->

            <!-- Previous Bills
        <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Previous Statements</h3>

        <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100">
            <tr>
                <th class="py-2 px-4">Date</th>
                <th class="py-2 px-4">Bill No.</th>
                <th class="py-2 px-4 text-right">Amount (RM)</th>
                <th class="py-2 px-4 text-right">Status</th>
                <th class="py-2 px-4 text-right">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(bill, index) in paginatedBills"
                :key="index"
                class="border-b"
            >
                <td class="py-2 px-4">{{ bill.date }}</td>
                <td class="py-2 px-4">{{ bill.billNo }}</td>
                <td class="py-2 px-4 text-right">{{ bill.amount.toFixed(2) }}</td>
                <td class="py-2 px-4 text-right">
                <span
                    :class="bill.status === 'Paid' ? 'text-green-600' : 'text-red-600'"
                >
                    {{ bill.status }}
                </span>
                </td>
                <td class="py-2 px-4 text-right">
                <button
                    class="text-blue-600 hover:underline"
                    @click="downloadBill(bill.billNo)"
                >
                    Download
                </button>
                </td>
            </tr>
            </tbody>
        </table> -->

        <!-- Pagination Controls -->
        <!-- <div class="flex justify-between items-center mt-4">
            <p class="text-sm text-gray-600">
            Showing {{ startItem + 1 }}–{{ endItem }} of {{ previousBills.length }} results
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
                :disabled="endItem >= previousBills.length"
                @click="currentPage++"
            >
                Next
            </button>
            </div> -->
        <!-- </div>
        </div> -->
    </div>
  </DashboardLayout>
</template>
<script setup>
import DashboardLayout from "@/layouts/dashboard_template.vue";
import { ref, computed, onMounted } from "vue";
import api from '@/lib/apiClient'
import { useUserStore } from '@/stores/userStore'
// const itemsPerPage = 10;
// const currentPage = ref(1);
const loading = ref(false);
const keyId = ref('');
const userStore = useUserStore();
const user = userStore.user
// Calculate paginated slice
// const paginatedBills = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   return previousBills.value.slice(start, end);
// });

// const startItem = computed(() => (currentPage.value - 1) * itemsPerPage);
// const endItem = computed(() =>
//   Math.min(currentPage.value * itemsPerPage, previousBills.value.length)
// );

// Mock Data
const credit = ref(0.0);
const currentBill = ref(0.0);
const overdue = ref(0.0);

// const billItems = ref([
//   { id: 1, description: "Machine Maintenance Fee", amount: 30.0 },
//   { id: 2, description: "Collection Transport Cost", amount: 20.5 },
//   { id: 3, description: "Admin Fee", amount: 30.25 },
// ]);

// const previousBills = ref([
//   { date: "2025-09-01", billNo: "BILL-001", amount: 90.5, status: "Paid" },
//   { date: "2025-10-01", billNo: "BILL-002", amount: 110.25, status: "Unpaid" },
// ]);

// Example methods
async function fetchSecrets (){
  const res = await api.get('/api/secret/get-secret');
  keyId.value = res.data.keyId;
};
const fetchBills = async () => {
  const res = await api.get('/api/collectorbill/get-bill');
  credit.value = res.data.credit;
  currentBill.value = res.data.currentBill;
  overdue.value = res.data.overDue;
};
onMounted(async () => {
  console.log (user.name,user.email) ;
  fetchSecrets();
  fetchBills();
});
const payNow = async () => {
    if (!window.Razorpay) {
    alert("Razorpay SDK not loaded");
    return;
  }
  try {
    loading.value = true;
    const { data: order } = await api.post("/api/razorpay/create-order", {
      Amount: currentBill.value * 100, // in cents
    });
   var options = {
    key: "rzp_live_Rhd15wtgAu0NLY",
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: "GoHijau",
    description: "Wallet Top-up",
    receipt: order.receipt,
    prefill: {
      name: user.name,
      email: user.email,
    },
    //live callback URL
    callback_url: "https://services.gohijau.org/api/razorpay/callback",
    //development callback URL
    // callback_url: "http://localhost:7192/api/razorpay/callback",
    redirect: true, // required for FPX
  };
var rzp1 = new Razorpay(options);
 rzp1.open();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const downloadBill = (billNo) => {
  alert(`Downloading bill statement: ${billNo}`);
};

// Auto-deduct logic
onMounted(() => {
  credit.value = credit.value - currentBill.value;
});
</script>
