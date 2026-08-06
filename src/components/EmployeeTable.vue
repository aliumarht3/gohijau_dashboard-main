<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-md font-semibold text-gray-700">
        {{ title }}
      </h3>
      <div class="flex items-center gap-3">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="'Search ' + title.toLowerCase() + '...'"
          class="border rounded px-3 py-1.5 text-sm w-48 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          @click="$emit('add')"
          class="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 shadow-sm text-sm"
        >
          + Add {{ employeeType }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full bg-white">
        <thead>
          <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <th class="px-4 py-3">#</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Phone</th>
            <th class="px-4 py-3">NRIC/Passport</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(emp, index) in paginatedEmployees"
            :key="emp.id"
            class="hover:bg-gray-50 text-sm text-gray-800 border-t"
          >
            <td class="px-4 py-2">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="px-4 py-2 font-medium">{{ emp.name }}</td>
            <td class="px-4 py-2">{{ emp.email }}</td>
            <td class="px-4 py-2">{{ emp.phone || '—' }}</td>
            <td class="px-4 py-2">{{ emp.nricOrPassport || '—' }}</td>
            <td class="px-4 py-2 text-center space-x-2">
              <button
                @click="$emit('edit', emp)"
                class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                @click="$emit('remove', emp)"
                :disabled="loadingId === emp.id"
                class="px-3 py-1 text-white text-xs rounded-md"
                :class="loadingId === emp.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'"
              >
                <span v-if="loadingId === emp.id">Removing...</span>
                <span v-else>Remove</span>
              </button>
            </td>
          </tr>

          <tr v-if="paginatedEmployees.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-400 text-sm">
              No {{ title.toLowerCase() }} found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination (only if needed) -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-3">
      <span class="text-xs text-gray-500">Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-2 py-1 border rounded text-xs disabled:opacity-50"
        >
          Prev
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 border rounded text-xs disabled:opacity-50"
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
  employees: { type: Array, required: true },
  title: { type: String, default: 'Employees' },
  employeeType: { type: String, default: 'Employee' },
  loadingId: String,
})

defineEmits(['add', 'edit', 'remove'])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 5

const filteredEmployees = computed(() => {
  if (!searchQuery.value) return props.employees
  const q = searchQuery.value.toLowerCase()
  return props.employees.filter(
    (emp) =>
      (emp.name && emp.name.toLowerCase().includes(q)) ||
      (emp.email && emp.email.toLowerCase().includes(q)) ||
      (emp.phone && emp.phone.toLowerCase().includes(q)),
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize)))

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEmployees.value.slice(start, start + pageSize)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>
