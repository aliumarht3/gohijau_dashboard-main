<template>
  <Card>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Financial Overview</h2>
      <select
        v-model="selectedFilter"
        @change="updateChartData"
        class="border rounded px-2 py-1 text-sm"
      >
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </div>

    <apexchart
      type="line"
      height="320"
      :options="chartOptions"
      :series="series"
    />
  </Card>
</template>

<script setup>
import { ref } from "vue";
import Card from "@/components/Card.vue";
import VueApexCharts from "vue3-apexcharts";

// Register apexchart globally if not already
const apexchart = VueApexCharts;

const selectedFilter = ref("month");

const chartOptions = ref({
  chart: {
    id: "financial-data",
    toolbar: { show: false },
  },
  xaxis: {
    categories: [], // dynamically updated
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  colors: ["#16a34a", "#2563eb"], // green & blue
  dataLabels: { enabled: false },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
});

const series = ref([
  { name: "Revenue To Date", data: [] },
  { name: "Total Revenue", data: [] },
]);

// Mock financial data
const financialData = {
  week: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenueToDate: [1200, 1800, 2500, 3100, 4000, 4500, 5200],
    totalRevenue: [1500, 2000, 2800, 3500, 4300, 4900, 5500],
  },
  month: {
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenueToDate: [5000, 12000, 18000, 25000],
    totalRevenue: [6000, 14000, 20000, 28000],
  },
  year: {
    categories: [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ],
    revenueToDate: [12000, 22000, 31000, 40000, 52000, 65000, 72000, 83000, 91000, 100000, 115000, 125000],
    totalRevenue: [15000, 25000, 34000, 43000, 56000, 69000, 76000, 86000, 95000, 105000, 120000, 130000],
  },
};

function updateChartData() {
  const filter = selectedFilter.value;
  const data = financialData[filter];

  // Replace the whole chartOptions object to trigger re-render
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      categories: data.categories,
    },
  };

  // Update series
  series.value = [
    { name: "Revenue To Date", data: data.revenueToDate },
    { name: "Total Revenue", data: data.totalRevenue },
  ];
}

// Initialize default
updateChartData();
</script>
