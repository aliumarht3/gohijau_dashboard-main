<template>
  <div class="min-h-screen flex">
    <!-- Left Panel -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white">
      <h1 class="text-3xl font-bold text-green-700 mb-2">Welcome to GoHijau ♻️</h1>
      <p class="text-gray-500 mb-6">Sustainable Recycling, Smarter Living</p>

      <form @submit.prevent="handleLogin" class="w-full max-w-md space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div class="flex justify-between items-center text-sm text-gray-600">
          <label class="flex items-center">
            <input type="checkbox" class="mr-1" v-model="rememberMe" />
            Remember me
          </label>
          <router-link to="/forgot-password" class="hover:underline text-green-600">Forgot password?</router-link>
        </div>
          <button type="submit" :disabled="loading"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      </form>
    </div>

    <!-- Right Panel -->
     <div
      class="hidden md:flex w-1/2 bg-cover bg-center relative"
      :style="{ backgroundImage: `url(${plantSoil})` }"
    >
      <div class="absolute inset-0  bg-opacity-40 flex flex-col justify-center items-center text-center p-10 text-white">
        <h2 class="text-3xl font-bold mb-2">“Recycle Today for a Better Tomorrow”</h2>
        <p class="text-sm">Together we reduce, reuse, and regenerate 🌱</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, getProfile } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'
import plantSoil from '@/assets/plantsoil.jpg'
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const router = useRouter()
const error = ref('')
const userStore = useUserStore()
async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    const profile = await getProfile()
    console.log('Logged in user:', profile)
    userStore.setUser(profile)
    console.log('User role:', userStore.user.userRole)
    if (userStore.user.userRole === 'Manufacturer') {
      router.push('/machineManufacturer')
      return
    }else if (userStore.user.userRole === 'OilCollector') {
      router.push('/machineCollector')
      return
    }
    router.push('/')
  } catch (err) {
    console.log('error: ', err)
    // error.value = "Invalid email or password";
    error.value = err.response?.data || 'Login failed'
    alert(`❌ ${error.value || err}`);
  } finally {
    loading.value = false
  }
}
</script>
