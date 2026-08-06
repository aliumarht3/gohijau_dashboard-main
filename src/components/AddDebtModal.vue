<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-semibold text-gray-800">Add Debt</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Current Debt (RM)</label>
          <input
            :value="outstandingDebt"
            type="number"
            step="0.01"
            disabled
            class="w-full border rounded px-3 py-2 mt-1 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Add Debt Amount (RM)</label>
          <input
            v-model.number="debtIncrement"
            type="number"
            min="0"
            step="0.01"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">New Debt Preview (RM)</label>
          <input
            :value="newDebt"
            type="number"
            step="0.01"
            disabled
            class="w-full border rounded px-3 py-2 mt-1 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

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
            Add Debt
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  organization: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const debtIncrement = ref(0)

const outstandingDebt = computed(() => Number(props.organization?.outstandingDebt ?? 0))
const newDebt = computed(() => outstandingDebt.value + Math.max(0, Number(debtIncrement.value ?? 0)))

watch(
  () => props.show,
  (showing) => {
    if (showing) {
      debtIncrement.value = 0
    }
  },
)

function handleSubmit() {
  const increment = Number(debtIncrement.value ?? 0)
  if (increment <= 0) {
    alert('Add Debt Amount must be greater than 0.')
    return
  }
  emit('save', { debtIncrement: increment })
}
</script>
