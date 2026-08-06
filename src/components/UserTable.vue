<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users..."
        class="border rounded px-3 py-2 text-sm w-60 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <button
        @click="$emit('create')"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm"
      >
        + Create User
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full bg-white">
        <thead>
          <tr class="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th class="px-4 py-3">#</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Organization</th>
            <th class="px-4 py-3">Role</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in paginatedUsers"
            :key="user.id"
            class="hover:bg-gray-50 text-sm text-gray-800 border-t cursor-pointer"
            @click="$emit('view', user)"
          >
            <td class="px-4 py-2">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="px-4 py-2 font-medium">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.organizationName }}</td>
            <td class="px-4 py-2">{{ user.roles.join(', ') }}</td>
            <td class="px-4 py-2 text-center space-x-2">
              <button
                @click.stop="$emit('edit', user)"
                class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                @click.stop="$emit('delete', user)"
                :disabled="loadingId === user.id"
                class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                :class="
                  loadingId === user.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                "
              >
                <!-- Delete -->
                <span v-if="loadingId === user.id">Deleting...</span>
                <span v-else>Delete</span>
              </button>
            </td>
          </tr>

          <tr v-if="paginatedUsers.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-500">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-600"> Page {{ currentPage }} of {{ totalPages }} </span>
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
  users: { type: Array, required: true },
  loadingId: String,
})

const emit = defineEmits(['edit', 'delete', 'create', 'view'])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 5

const filteredUsers = computed(() => {
  if (!searchQuery.value) return props.users
  return props.users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (u.roles && u.roles.some(role => role.toLowerCase().includes(searchQuery.value.toLowerCase()))),
  )
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Reset to page 1 when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>
