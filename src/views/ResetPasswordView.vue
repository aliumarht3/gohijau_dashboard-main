<template>
  <div class="min-h-screen flex">
    <!-- Left Panel -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white">
      <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold text-green-700 mb-2">Set New Password</h1>
        <p class="text-gray-500 mb-6">Enter your new password below</p>

        <form @submit.prevent="handleResetPassword" class="space-y-4" v-if="!tokenInvalid">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">New Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm your password"
            />
          </div>

          <div v-if="passwordMismatch" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            Passwords do not match
          </div>

          <button
            type="submit"
            :disabled="loading || passwordMismatch"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300 disabled:opacity-50"
          >
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <div v-if="successMessage" class="p-4 bg-green-100 text-green-700 rounded-md">
          <p class="font-semibold">✓ Password Reset Successful</p>
          <p class="text-sm mt-2">{{ successMessage }}</p>
        </div>

        <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded-md">
          ✗ {{ errorMessage }}
        </div>

        <div v-if="tokenInvalid" class="p-4 bg-red-100 text-red-700 rounded-md">
          <p class="font-semibold">✗ Invalid or Expired Link</p>
          <p class="text-sm mt-2">This password reset link is invalid or has expired. Please request a new one.</p>
          <router-link to="/forgot-password" class="text-red-600 hover:underline text-sm mt-4 inline-block">Request a new reset link</router-link>
        </div>
      </div>
    </div>

    <!-- Right Panel -->
    <div
      class="hidden md:flex w-1/2 bg-cover bg-center relative"
      :style="{ backgroundImage: `url(${plantSoil})` }"
    >
      <div class="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center p-10 text-white">
        <h2 class="text-3xl font-bold mb-2">"Recycle Today for a Better Tomorrow"</h2>
        <p class="text-sm">Together we reduce, reuse, and regenerate 🌱</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { resetPassword, validateResetToken } from '@/services/auth'
import plantSoil from '@/assets/plantsoil.jpg'

const router = useRouter()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const tokenInvalid = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const token = ref('')

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
})

onMounted(async () => {
  token.value = route.query.token

  if (!token.value) {
    tokenInvalid.value = true
    return
  }

  try {
    await validateResetToken(token.value)
  } catch (err) {
    console.error('Token validation failed:', err)
    tokenInvalid.value = true
  }
})

async function handleResetPassword() {
  if (passwordMismatch.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  errorMessage.value = ''
  loading.value = true

  try {
    await resetPassword(token.value, password.value)
    successMessage.value = 'Your password has been reset successfully. Redirecting to login...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error('Error resetting password:', err)
    errorMessage.value = err.response?.data?.message || 'Failed to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
