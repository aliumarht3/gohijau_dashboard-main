<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <!-- Header -->
      <h2 class="text-lg font-semibold mb-4">
        {{ user && user.id ? 'Edit User' : 'Create User' }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Email</label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Phone</label>
          <input
            v-model="formData.phone"
            type="text"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">NRIC/Passport</label>
          <input
            v-model="formData.nricOrPassport"
            type="text"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Organization</label>
          <select
            v-model="formData.organizationId"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="" disabled>Select organization</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.organizationName }}
            </option>
          </select>
        </div>

        <div v-if="!user">
          <label class="block text-sm font-medium">Role</label>
          <select
            v-model="formData.rolesId[0]"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="" disabled>Select role</option>
            <option v-for="role in filteredRoles" :key="role.roleId" :value="role.roleId">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Error banner -->
        <div
          v-if="saveError"
          class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <svg class="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
          </svg>
          <span>{{ saveError }}</span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            :disabled="isSaving"
            @click="$emit('close')"
            class="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isSaving"
              class="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {{ isSaving ? (user && user.id ? 'Saving…' : 'Creating…') : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  organizations: Array,
  rolesId: Array,
  roles: Array,
  user: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
  saveError: { type: String, default: null },
})

const emit = defineEmits(['close', 'save'])

const EXCLUDED_ROLES = ['Technician', 'OilCollector']
const filteredRoles = computed(() =>
  (props.roles || []).filter((r) => !EXCLUDED_ROLES.includes(r.name)),
)

const formData = ref({
  name: '',
  email: '',
  organizationId: '',
  rolesId: [''],
})

// Reset form whenever modal opens or user changes
watch(
  () => props.user,
  (newUser) => {
    formData.value = newUser
      ? { ...newUser }
      : { name: '', email: '', organizationId: '', rolesId: [''] }
  },
  { immediate: true },
)

function handleSubmit() {
  const mode = props.user ? 'edit' : 'create'
  emit('save', { mode, formData: { ...formData.value } })
}
</script>
