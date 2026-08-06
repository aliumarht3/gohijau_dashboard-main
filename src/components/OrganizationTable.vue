<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search organizations..."
        class="border rounded px-3 py-2 text-sm w-60 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <button
        v-if="canCreate"
        @click="$emit('create')"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm"
      >
        + Create Organization
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full bg-white">
        <thead>
          <tr class="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th class="px-4 py-3">#</th>
            <th class="px-4 py-3">Organization Name</th>
            <th class="px-4 py-3">Address</th>
            <th class="px-4 py-3">Collector Rate</th>
            <th class="px-4 py-3">Profit Rate</th>
            <th class="px-4 py-3">Credit Limit</th>
            <th class="px-4 py-3">Outstanding / Total Debt</th>
            <th class="px-4 py-3">Created</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(org, index) in paginatedOrganizations"
            :key="org.id"
            class="hover:bg-gray-50 text-sm text-gray-800 border-t"
          >
            <td class="px-4 py-2">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="px-4 py-2 font-medium">{{ org.organizationName }}</td>
            <td class="px-4 py-2">{{ formatAddress(org.address) }}</td>
            <td class="px-4 py-2">{{ org.collectorRate != null ? org.collectorRate : '—' }}</td>
            <td class="px-4 py-2">{{ org.profitRate != null ? org.profitRate : '—' }}</td>
            <td class="px-4 py-2">{{ org.creditLimit != null ? `RM ${org.creditLimit.toFixed(2)}` : '—' }}</td>
            <td class="px-4 py-2">{{ org.totalDebtAssigned != null ? `RM${org.outstandingDebt.toFixed(2)} / RM${org.totalDebtAssigned.toFixed(2)}` : '—' }}</td>
            <td class="px-4 py-2">{{ formatDate(org.createdAt) }}</td>
            <td class="px-4 py-2 text-center space-x-2">
              <button
                @click="$emit('view', org)"
                class="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600"
              >
                View
              </button>
              <button
                @click="$emit('edit', org)"
                class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                v-if="canDelete"
                @click="$emit('delete', org)"
                :disabled="loadingId === org.id"
                class="px-3 py-1 text-white text-xs rounded-md"
                :class="loadingId === org.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'"
              >
                <span v-if="loadingId === org.id">Deleting...</span>
                <span v-else>Delete</span>
              </button>
            </td>
          </tr>

          <tr v-if="paginatedOrganizations.length === 0">
            <td colspan="9" class="text-center py-4 text-gray-500">No organizations found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  organizations: { type: Array, required: true },
  loadingId: String,
  canCreate: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
})

defineEmits(['create', 'edit', 'delete', 'view'])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 8

const filteredOrganizations = computed(() => {
  if (!searchQuery.value) return props.organizations
  const q = searchQuery.value.toLowerCase()
  return props.organizations.filter(
    (org) =>
      (org.organizationName && org.organizationName.toLowerCase().includes(q)) ||
      (org.address && formatAddress(org.address).toLowerCase().includes(q)),
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrganizations.value.length / pageSize)))

const paginatedOrganizations = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrganizations.value.slice(start, start + pageSize)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function formatAddress(address) {
  if (!address) return '—'
  const parts = [address.street, address.district, address.state, address.country].filter(Boolean)
  return parts.join(', ') || '—'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>
