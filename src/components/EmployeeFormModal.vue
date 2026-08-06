<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">
          {{ employee ? `Edit ${employeeType}` : `Add ${employeeType}` }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name <span class="text-red-500">*</span></label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Phone <span class="text-red-500">*</span></label>
          <input
            v-model="formData.phone"
            type="text"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">NRIC/Passport <span class="text-red-500">*</span></label>
          <input
            v-model="formData.nricOrPassport"
            type="text"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {{ employee ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  employee: { type: Object, default: null },
  employeeType: { type: String, default: 'Employee' },
  organizationId: { type: String, default: '' },
  roleId: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'save'])

const defaultFormData = () => ({
  name: '',
  email: '',
  phone: '',
  nricOrPassport: '',
})

const formData = ref(defaultFormData())

watch(
  () => [props.employee, props.show],
  ([newEmp, showing]) => {
    if (!showing) return
    if (newEmp) {
      formData.value = {
        id: newEmp.id,
        name: newEmp.name || '',
        email: newEmp.email || '',
        phone: newEmp.phone || '',
        nricOrPassport: newEmp.nricOrPassport || '',
      }
    } else {
      formData.value = defaultFormData()
    }
  },
  { immediate: true },
)

function handleSubmit() {
  const mode = props.employee ? 'edit' : 'create'
  emit('save', {
    mode,
    formData: {
      ...formData.value,
      organizationId: props.organizationId,
      rolesId: [props.roleId],
    },
  })
}
</script>
