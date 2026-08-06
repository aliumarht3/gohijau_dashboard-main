<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg">
      <h3 class="text-lg font-semibold mb-4">User Details</h3>

      <div class="space-y-2 text-sm">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone || '-' }}</p>
        <p><strong>Organization:</strong> {{ user.organizationName || '-' }}</p>
        <p><strong>Roles:</strong> {{ user.roles.join(', ') }}</p>
        <p><strong>EWallet Balance:</strong> RM {{ user.pointsAwarded.toFixed(2)}}</p>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  user: Object,
})

defineEmits(['close'])
</script>
