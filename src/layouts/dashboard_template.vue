<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Navbar with dynamic margin to match sidebar -->
      <Navbar :collapsed="collapsed" />

      <main class="p-6 overflow-y-auto flex-1">
        <slot />  
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import { useSidebarStore } from '@/stores/sidebar';
import { storeToRefs } from 'pinia';

const store = useSidebarStore();
const { collapsed } = storeToRefs(store);
</script>