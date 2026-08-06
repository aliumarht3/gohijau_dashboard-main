<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search machines..."
        class="border rounded px-3 py-2 text-sm w-60 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <button
        @click="$emit('create')"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm"
      >
        + Add Machine
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full bg-white">
        <thead>
          <tr class="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th class="px-4 py-3">Device ID</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Active Status</th>
            <th class="px-4 py-3">Owner</th>
            <th class="px-4 py-3">Owner Contact</th>
            <th class="px-4 py-3">Capacity</th>
            <th class="px-4 py-3">Manufactured Date</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="machine in paginatedMachines"
            :key="machine.id"
            class="hover:bg-gray-50 text-sm text-gray-800 border-t"
          >
            <td class="px-4 py-2">{{ machine.deviceId || "-" }}</td>
            <td class="px-4 py-2 font-medium">{{ machine.name }}</td>
            <td class="px-4 py-2">{{ machine.type }}</td>
            <td class="px-4 py-2">{{ machine.status }}</td>
            <td class="px-4 py-2">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-semibold',
                  machine.activeStatus === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
                ]"
              >
                {{ machine.activeStatus || 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-2">
              {{ ownersMap[machine.owner] || "-" }}
            </td>
            <td class="px-4 py-2">
              <template v-if="ownerUsersMap[machine.owner]">
                <p class="font-medium">{{ ownerUsersMap[machine.owner].name }}</p>
                <p class="text-xs text-gray-500">{{ ownerUsersMap[machine.owner].phone || '—' }}</p>
              </template>
              <span v-else>—</span>
            </td>
            <td class="px-4 py-2">
              {{ (machine.capacity !== null && machine.capacity !== "") ? parseFloat(machine.capacity).toFixed(2) + "/100 KG" : "-" }}
            </td>
            <td class="px-4 py-2">
              {{ formatDate(machine.manufacturedDate) }}
            </td>
            <td class="px-4 py-2 text-center space-x-2">
              <button
                @click="$emit('view-history', machine)"
                class="px-3 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors"
                title="View History"
              >
                History
              </button>
              <button
                v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'"
                @click="$emit('edit', machine)"
                class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'"
                @click="$emit('delete', machine)"
                class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="paginatedMachines.length === 0">
            <td colspan="10" class="text-center py-4 text-gray-500">
              No machines found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
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
import { ref, computed } from "vue";
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const userRole = userStore.user.userRole;
const props = defineProps({
  machines: { type: Array, required: true },
  owners: { type: Array, required: true },
  ownerUsers: { type: Array, default: () => [] },
});

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 5;

const ownersMap = computed(() =>
  props.owners.reduce((map, o) => {
    map[o.id] = o.organizationName;
    return map;
  }, {})
);

// Maps owner org ID → { name, phone } of the user with Owner role in that org
const ownerUsersMap = computed(() =>
  props.ownerUsers.reduce((map, u) => {
    if (u.organizationId && !map[u.organizationId]) {
      map[u.organizationId] = { name: u.name, phone: u.phone };
    }
    return map;
  }, {})
);

const filteredMachines = computed(() => {
  if (!searchQuery.value) return props.machines;
  return props.machines.filter((m) =>
    Object.values(m).some((val) =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredMachines.value.length / pageSize)
);
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
const paginatedMachines = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredMachines.value.slice(start, start + pageSize);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
</script>
