<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
import { useRouter } from 'vue-router'
import { useUserStoreProfileCall } from '@/services/useUserStore'
const router = useRouter()

const userStore = useUserStoreProfileCall()
userStore.fetchProfile() // fetch when entering page

function logout() {
  localStorage.removeItem('access_token')
  router.push('/login')
}
</script>

<!-- <template>
  <main>
    <TheWelcome />
  </main>
</template> -->

<template>
  <div>
    <h1>Welcome Home, {{ userStore.profile?.name }}</h1>
    <button @click="logout">Logout</button>
  </div>
</template>
