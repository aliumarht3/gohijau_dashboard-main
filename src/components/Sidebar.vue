<template>
<aside
  :class="[
    'bg-white shadow-md h-full transition-all duration-300 flex flex-col',
    collapsed ? 'w-20' : 'w-64'
  ]"
>
  <div class="h-16 bg-gradient-to-b from-green-700 to-green-500 flex items-center shadow-md px-7 justify-between">
    <span v-if="!collapsed" class="text-lg font-bold text-white">GoHijau</span>
   <button @click="toggle" class="p-2 focus:outline-none hover:text-primary">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
</button>
  </div>
    <nav class="mt-4 space-y-1 flex-1">
      <SidebarItem
        v-for="item in filteredMenu"
        :key="item.to"
        :icon="item.icon"
        :label="item.label"
        :to="item.to"
        :collapsed="collapsed"
      />
    </nav>
</aside>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebar';
import SidebarItem from './SidebarItem.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
const store = useSidebarStore();
const userStore = useUserStore()
const { collapsed } = storeToRefs(store);  // ✅ reactive reference
const toggle = store.toggle;
const allMenuItems = [
  { icon: 'home', label: 'Dashboard', to: '/', roles: ['Admin', 'GoHijauOwner', 'Owner'] },
  { icon: 'building', label: 'Organization', to: '/organizationManagement', roles: ['Admin', 'GoHijauOwner', 'OilCollector', 'Owner'] },
  { icon: 'user', label: 'User', to: '/userManagement', roles: ['Admin', 'GoHijauOwner'] },
  { icon: 'machine', label: 'Machine', to: '/machineManagement', roles: ['Admin', 'GoHijauOwner', 'Owner'] },
  { icon: 'truck', label: 'Manufacturer', to: '/machineManufacturer', roles: ['Admin', 'GoHijauOwner','Manufacturer'] },
  { icon: 'chart-bar', label: 'Telemetry', to: '/telemetry', roles: ['Admin','GoHijauOwner','OilCollector'] },
  
  // Add 1.0 and rename 2.0 here:
  { icon: 'wrench', label: 'Diagnostics 1.0', to: '/diagnostics-old', roles: ['Admin'] },
  { icon: 'wrench', label: 'Diagnostics 2.0', to: '/diagnostics', roles: ['Admin'] },
  { icon: 'clipboard-check', label: 'Physical Check History', to: '/physical-history', roles: ['Admin'] },
  
  { icon: 'scale', label: 'OilCollector', to: '/machineCollector', roles: ['OilCollector'] },
  { icon: 'history', label: 'Collector History', to: '/collectorHistory', roles: ['Admin', 'GoHijauOwner', 'OilCollector'] },
  { icon: 'scale', label: 'Owner Payout ', to: '/ownerPayout', roles: ['Owner'] },
]
const filteredMenu = computed(() => {
  if (!userStore.user) return []

  const role = userStore.user.userRole;
  return allMenuItems.filter(item => item.roles.includes(role))
})
</script>
