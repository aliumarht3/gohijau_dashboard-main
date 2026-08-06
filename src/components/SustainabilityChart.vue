<template>
  <Card class="mt-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Sustainability Metrics</h2>
      <button
        @click="toggleView"
        class="border rounded px-3 py-1 text-sm hover:bg-gray-100"
      >
        {{ showBreakdown ? "Show Overall" : "Show Breakdown" }}
      </button>
    </div>

    <!-- Overall View: 2 radial gauges -->
    <div v-if="!showBreakdown" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Carbon Credits Gauge -->
      <apexchart
        type="radialBar"
        height="280"
        :options="carbonGaugeOptions"
        :series="[carbonGaugeValue]"
      />

      <!-- ESG Impact Gauge -->
      <apexchart
        type="radialBar"
        height="280"
        :options="esgGaugeOptions"
        :series="[esgGaugeValue]"
      />
    </div>

    <!-- Breakdown View: Carbon breakdown + ESG breakdown side by side -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Carbon Credit Breakdown Pie Chart -->
      <apexchart
        type="pie"
        height="320"
        :options="carbonPieOptions"
        :series="carbonPieSeries"
      />

      <!-- ESG Impact Breakdown Pie Chart -->
      <div>
        <apexchart
          v-if="esgPieSeries.some(val => val > 0)"
          type="pie"
          height="320"
          :options="esgPieOptions"
          :series="esgPieSeries"
        />
        <div v-else class="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-sm">No ESG data available</p>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed,onMounted } from "vue";
import Card from "@/components/Card.vue";
import VueApexCharts from "vue3-apexcharts";
import { calculateSustainabilityMetrics } from "@/utils/sustainabilityCalculator";
import { fetchOilData } from '@/services/transactionService'
const oilRecycledTonnes = ref(0);
const loading = ref(true)
const error = ref('')
onMounted(async () => {
  try {
    const totalOil = await fetchOilData()
    // Convert litres → tonnes if necessary (approx: 1 tonne ≈ 1136 litres)
    oilRecycledTonnes.value = totalOil / 1136
  } catch (err) {
    console.error('Error fetching oil data:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
})
const sustainability = computed(() =>
  calculateSustainabilityMetrics(oilRecycledTonnes.value)
);
const carbonGaugeValue = computed(() => {
  const carbonGauge = sustainability.value.carbonCredits
  return isNaN(Number(carbonGauge)) ? -1 : Number(carbonGauge)
});

const esgGaugeValue = computed(() => {
  const esg = sustainability.value.esgScore
  return isNaN(Number(esg)) ? -1 : Number(esg)
});
// ESG Pie Series - ensure we have numeric values
const esgPieSeries = computed(() => {
  const envScore = Number(sustainability.value.envScore) || 0;
  const socialScore = Number(sustainability.value.socialScore) || 0;
  const governanceScore = Number(sustainability.value.governanceScore) || 0;
  console.log('ESG Pie Series:', { envScore, socialScore, governanceScore });
  return [envScore, socialScore, governanceScore];
});
const apexchart = VueApexCharts;

const showBreakdown = ref(false);

function toggleView() {
  showBreakdown.value = !showBreakdown.value;
}

// Gauge Options
const carbonGaugeOptions = computed(() => ({
  labels: ["Carbon Credits"],
  colors: [carbonGaugeValue.value < 0 ? "#f87171" : "#10b981"],
  plotOptions: {
    radialBar: {
      hollow: { size: "60%" },
      dataLabels: { value: { fontSize: "18px",
                              formatter: (carbonGauge) => {
                                  return carbonGauge < 0 || isNaN(carbonGauge) ? "Error" : `${carbonGauge}%`
                                },
                            } },
    },
  },
}));

const esgGaugeOptions = computed(() => ({
  labels: ["ESG Impact"],
  colors: [esgGaugeValue.value < 0 ? "#f87171" : "#10b981"],
  plotOptions: {
    radialBar: {
      hollow: { size: "60%" },
      dataLabels: { value: { fontSize: "18px",
                              formatter: (esg) => {
                                  return esg < 0 || isNaN(esg) ? "Error" : `${esg}%`
                                },
                            } },
    },
  },
}));

// Pie Breakdown Options
const carbonPieSeries = computed(() => {
  const b = sustainability.value.carbonBreakdown;
  return [b.manufacturing, b.recycling, b.energy, b.transport];
});

const carbonPieOptions = {
  labels: [
    "Virgin Oil Production Avoided",
    "Recycling Process",
    "Energy Offset (Biofuel Use)",
    "Transport Optimization",
  ],
  colors: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
  legend: { position: "bottom" },
  title: {
    text: "Carbon Credit Breakdown",
    align: "center",
    style: {
      fontSize: "14px",
      fontWeight: "600",
    },
  },
  dataLabels: {
    formatter: (val, opts) => val.toFixed(1) + "%",
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(2)} tCO₂e`,
    },
  },
};

const esgPieOptions = {
  labels: ["Environmental", "Social", "Governance"],
  colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
  legend: {
    position: "bottom",
    fontSize: "12px",
  },
  title: {
    text: "ESG Impact Breakdown",
    align: "center",
    style: {
      fontSize: "14px",
      fontWeight: "600",
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1) + "%",
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(1)} points`,
    },
  },
  chart: {
    type: 'pie',
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: -5,
      },
    },
  },
};
</script>
