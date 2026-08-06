<template>
  <div class="min-h-screen flex">
    <!-- Left Panel -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white">
      <div class="w-full max-w-md">
        <router-link to="/login" class="text-green-600 hover:underline text-sm mb-4 inline-block">&larr; Back to Login</router-link>

        <h1 class="text-3xl font-bold text-green-700 mb-2">Reset Password</h1>
        <p class="text-gray-500 mb-6">Enter your email address and we'll send you a link to reset your password.</p>

        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300 disabled:opacity-50"
          >
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <div v-if="successMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          ✓ {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          ✗ {{ errorMessage }}
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestPasswordReset } from '@/services/auth'
import plantSoil from '@/assets/plantsoil.jpg'

const email = ref('')
const loading = ref(false)
const router = useRouter()
const successMessage = ref('')
const errorMessage = ref('')

async function handleForgotPassword() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await requestPasswordReset(email.value)
    successMessage.value = `Password reset link has been sent to ${email.value}. Check your inbox (and spam folder) for the email.`
    email.value = ''

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 10000)
  } catch (err) {
    console.error('Error requesting password reset:', err)
    errorMessage.value = err.response?.data?.message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
