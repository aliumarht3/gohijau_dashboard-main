<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
</script>

<template>
  <router-view :key="router.currentRoute.value.fullPath + userStore.user?.userRole" />
</template>


