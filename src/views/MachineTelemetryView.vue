<template>
  <DashboardLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Machine Telemetry</h1>
      <button 
          @click="fetchTelemetry" 
          :disabled="isRefreshing"
          class="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
        >
          <svg :class="{ 'animate-spin': isRefreshing }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" v-if="machines.length > 0">
      <Card v-for="machine in machines" :key="machine.machineId" class="relative overflow-hidden">
        
        <!-- UPDATED TOP RIGHT CORNER -->
        <div class="absolute top-4 right-4 flex items-center gap-2">
          <span class="relative flex h-3 w-3">
            <span :class="machine.isOnline ? 'bg-green-400' : 'bg-red-400'" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
            <span :class="machine.isOnline ? 'bg-green-500' : 'bg-red-500'" class="relative inline-flex rounded-full h-3 w-3"></span>
          </span>
          <span class="text-xs font-semibold text-gray-600">
            {{ machine.timestamp ? formatLastUpdated(machine.timestamp) : 'Waiting...' }}
          </span>
        </div>
        <!-- END UPDATED TOP RIGHT CORNER -->

        <h2 class="text-lg font-bold text-gray-900 mb-4">{{ machine.machineId }}</h2>

        <div class="mb-4">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-semibold text-gray-700">Main Tank ({{ getTankCapacity(machine.machineId) }}L)</span>
            <span class="font-bold text-green-700">{{ getCorrectedVolume(machine.machineId, machine.metrics?.mainTankVolumeLiters).toFixed(1) }} L</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="h-3 rounded-full transition-all duration-500"
              :class="getTankColor(getTankPercentage(getCorrectedVolume(machine.machineId, machine.metrics?.mainTankVolumeLiters), getTankCapacity(machine.machineId)))"
              :style="{ width: `${getTankPercentage(getCorrectedVolume(machine.machineId, machine.metrics?.mainTankVolumeLiters), getTankCapacity(machine.machineId))}%` }"
            ></div>
          </div>
          <p class="text-xs text-right mt-1 text-gray-500">
            {{ getTankPercentage(getCorrectedVolume(machine.machineId, machine.metrics?.mainTankVolumeLiters), getTankCapacity(machine.machineId)).toFixed(1) }}% Full
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-xs text-gray-500 mb-1">Oil Quality (Turbidity)</p>
            <p class="text-sm font-bold" :class="machine.metrics?.turbidityValue > 600 ? 'text-red-600' : 'text-green-600'">
              {{ machine.metrics?.turbidityValue || 0 }} 
              <span class="text-xs font-normal text-gray-500">
                ({{ machine.metrics?.turbidityValue > 600 ? 'Poor' : 'Good' }})
              </span>
            </p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-xs text-gray-500 mb-1">Junk Tank Lvl</p>
            <p class="text-sm font-bold text-gray-800">{{ machine.metrics?.junkTankDistanceCm || 0 }} cm <span class="text-xs font-normal text-gray-500">to top</span></p>
          </div>
        </div>
      </Card>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      <h3 class="text-lg font-medium text-gray-900">No Active Machines</h3>
      <p class="text-gray-500 mt-1">Waiting for live telemetry data to be transmitted...</p>
    </div>

  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DashboardLayout from '@/layouts/dashboard_template.vue';
import Card from '@/components/Card.vue';
import api from '@/lib/apiClient';
import * as signalR from '@microsoft/signalr';

const machines = ref([]);
const isRefreshing = ref(false); 
let connection = null;

// Convert the ISO timestamp string into a readable format (e.g. "Updated: 10:45:30 AM")
const formatLastUpdated = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `Updated: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
};

// Dynamically set capacity: Machine 2 is 500L, all others default to 100L
const getTankCapacity = (machineId) => {
  return (machineId === 'GO-000002' || machineId === '2') ? 500 : 100;
};

// Downscale the raw volume sent by Python (which hardcodes 500L) to the true capacity
const getCorrectedVolume = (machineId, rawVolume = 0) => {
  const trueCapacity = getTankCapacity(machineId);
  // Divide by 500 to get the physical percentage of the tank, then multiply by actual capacity
  const correctedVolume = (rawVolume / 500) * trueCapacity;
  return Math.max(0, correctedVolume);
};

// Calculate percentage and ensure it never exceeds 100%
const getTankPercentage = (volume = 0, capacity = 100) => {
  if (!capacity || capacity <= 0) return 0;
  const percentage = (volume / capacity) * 100;
  return Math.min(100, Math.max(0, percentage));
};

const getTankColor = (percentage) => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-yellow-400';
  return 'bg-green-500';
};

const fetchTelemetry = async () => {
  isRefreshing.value = true; 
  try {
    const { data } = await api.get('/api/machine/telemetry');
    machines.value = data || [];
  } catch (error) {
    console.error("Failed to fetch machine telemetry:", error);
  } finally {
    setTimeout(() => { isRefreshing.value = false; }, 500); 
  }
};

onMounted(async () => {
  await fetchTelemetry();

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:7192/machineHub")
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveTelemetryUpdate", (updatedMachine) => {
    const index = machines.value.findIndex(m => m.machineId === updatedMachine.machineId);
    if (index !== -1) {
      machines.value[index] = updatedMachine;
    } else {
      machines.value.push(updatedMachine);
    }
  });

  try {
    await connection.start();
    console.log("🟢 Connected to live telemetry stream");
  } catch (err) {
    console.error("🔴 SignalR Connection Error: ", err);
  }
});

onUnmounted(() => {
  if (connection) {
    connection.stop();
  }
});
</script>
