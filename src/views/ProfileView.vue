<template>
 <DashboardLayout>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>

    <!-- Profile Card -->
    <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
      <div class="flex items-center space-x-4">
        <img
          src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
          alt="User Avatar"
          class="w-16 h-16 rounded-full"
        />
        <div>
          <h3 class="text-lg font-semibold text-gray-800">
            {{ user.name }}
          </h3>
          <p class="text-gray-500 text-sm">{{ user.email }}</p>
        </div>
      </div>

      <hr class="my-4" />

      <!-- Password Reset Section -->
      <div>
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Change Password</h4>

        <form @submit.prevent="changePassword" class="space-y-4">
            <div>
    <label class="block text-sm font-medium text-gray-700">Current Password</label>
    <div class="relative">
      <input
        :type="showCurrentPassword ? 'text' : 'password'"
        v-model="currentPassword"
        class="mt-1 block w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
        required
      />
      <button
        type="button"
        @click="showCurrentPassword = !showCurrentPassword"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg
          v-if="!showCurrentPassword"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.959 9.959 0 012.293-3.95m3.676-2.64A9.967 9.967 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.362M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3l18 18"
          />
        </svg>
      </button>
    </div>
  </div>

        <!-- New Password -->
  <div>
    <label class="block text-sm font-medium text-gray-700">New Password</label>
    <div class="relative">
      <input
        :type="showNewPassword ? 'text' : 'password'"
        v-model="newPassword"
        class="mt-1 block w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
        required
      />
      <button
        type="button"
        @click="showNewPassword = !showNewPassword"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg
          v-if="!showNewPassword"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.959 9.959 0 012.293-3.95m3.676-2.64A9.967 9.967 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.362M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3l18 18"
          />
        </svg>
      </button>
    </div>
  </div>

    <div>
    <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
    <div class="relative">
      <input
        :type="showConfirmPassword ? 'text' : 'password'"
        v-model="confirmPassword"
        class="mt-1 block w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
        required
      />
      <button
        type="button"
        @click="showConfirmPassword = !showConfirmPassword"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg
          v-if="!showConfirmPassword"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.959 9.959 0 012.293-3.95m3.676-2.64A9.967 9.967 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.362M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3l18 18"
          />
        </svg>
      </button>
    </div>
  </div>
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  </div>
</DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import api from '@/lib/apiClient'
import DashboardLayout from "@/layouts/dashboard_template.vue";
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const userStore = useUserStore()
const user = userStore.user

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }

  try {
    await api.patch('/api/user/change-password', {
      CurrentPassword: currentPassword.value,
      NewPassword: newPassword.value,
    })

    alert('Password updated successfully!')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    alert('Failed to change password: ' + (error.response?.data?.message || error.message))
  }
}
</script>
