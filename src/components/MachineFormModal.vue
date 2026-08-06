<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
      <!-- Header -->
      <h2 class="text-lg font-semibold mb-4">
        {{ machine && machine.id ? "Edit Machine" : "Create Machine" }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">
        <!-- Device ID -->
        <div>
          <label class="block text-sm font-medium">Device IDs</label>
          <template v-if="isEditMode">
            <!-- read-only plain look -->
            <input
              type="text"
              v-model="formData.deviceId"
              disabled
              class="w-full border rounded px-3 py-2 mt-1 text-sm bg-gray-100 cursor-not-allowed"
            />
          </template>

          <template v-else>
              <SearchableSelect
                v-model="formData.deviceId"
                :options="unassignedMachines"
                option-label="machineId"
                option-value="machineId"
              />
          </template>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium">Location Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full border rounded px-3 py-2 mt-1 text-sm"
          />
        </div>

        <!-- Unit No -->
        <div>
          <label class="block text-sm font-medium">Unit No</label>
          <input
            v-model="formData.unitNo"
            type="text"
            class="w-full border rounded px-3 py-2 mt-1 text-sm"
          />
        </div>

        <!-- Street -->
        <div>
          <label class="block text-sm font-medium">Street</label>
          <input
            v-model="formData.street"
            type="text"
            class="w-full border rounded px-3 py-2 mt-1 text-sm"
          />
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium">Country</label>
          <SearchableSelect v-model="formData.country" :options="countries" />
        </div>

        <!-- State -->
        <div>
          <label class="block text-sm font-medium">State</label>
          <SearchableSelect v-model="formData.state" :options="filteredStates"/>
        </div>

        <!-- District -->
        <div>
          <label class="block text-sm font-medium">District</label>
          <SearchableSelect
            v-model="formData.district"
            :options="filteredDistricts"
          />
        </div>

        <!-- Postcode -->
        <div>
          <label class="block text-sm font-medium">Postcode</label>
          <input
            v-model="formData.postcode"
            type="text"
            class="w-full border rounded px-3 py-2 mt-1 text-sm"
          />
        </div>

        <!-- Coordinates -->
        <div class="col-span-2 flex items-center space-x-2">
          <div class="flex-1">
            <label class="block text-sm font-medium">Coordinates</label>
            <input
              v-model="formData.coordinates"
              readonly
              placeholder="Lat, Lng"
              class="w-full border rounded px-3 py-2 mt-1 text-sm bg-gray-100"
            />
          </div>
          <button
            type="button"
            @click="openMap"
            class="mt-6 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            📍
          </button>
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-medium">Type</label>
          <SearchableSelect v-model="formData.type" :options="types" />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium">Status</label>
          <SearchableSelect v-model="formData.status" :options="statuses" />
        </div>

        <!-- Owner -->
        <div>
          <label class="block text-sm font-medium">Owner</label>
          <SearchableSelect
            v-model="formData.ownerId"
            :options="owners"
            option-label="organizationName"
            option-value="id"
          />
        </div>
        <!--Oil Collector-->
        <div>
          <label class="block text-sm font-medium">Oil Collector</label>
          <SearchableSelect
            v-model="formData.collectorId"
            :options="collectors"
            option-label="organizationName"
            option-value="id"
          />
        </div>
        <!--Technician-->
        <div>
          <label class="block text-sm font-medium">Technician</label>
          <SearchableSelect
            v-model="formData.technicianId"
            :options="technicians"
            option-label="organizationName"
            option-value="id"
          />
        </div>
        <!-- Manufactured Date -->
        <div>
          <label class="block text-sm font-medium">Manufactured Date</label>
          <input
            v-model="formData.manufacturedDateDisplay"
            type="date"
            class="w-full border rounded px-3 py-2 mt-1 text-sm bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
        <!-- Actions -->
        <div class="col-span-2 flex justify-end space-x-2 pt-4">
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
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import SearchableSelect from "@/components/SearchableSelect.vue";

const props = defineProps({
  show: Boolean,
  machine: Object,
  countries: Array,
  coordinates: String,
  states: Array,
  districts: Array,
  owners: Array,
  types: Array,
  statuses: Array,
  collectors: Array,
  technicians: Array,
  unassignedMachines: Array,
});

const emit = defineEmits(["close", "save", "openMap"]);

const formData = ref({});

const isEditMode = computed(() => !!props.machine?.id);

// Reset form on open/edit
watch(
  () => props.coordinates,
  (newCoords) => {
    formData.value.coordinates = newCoords;
  }
);
watch(
  [() => props.machine, () => props.owners, () => props.collectors, () => props.technicians],
  ([newMachine]) => {
    if (newMachine) {
      formData.value = {
        id: newMachine.id,
        deviceId: newMachine.machineId || newMachine.deviceId || '',
        name: newMachine.name || '',
        unitNo: newMachine.unitNo || '',
        street: newMachine.street || '',
        district: newMachine.district || '',
        state: newMachine.state || '',
        country: newMachine.country || '',
        postcode: newMachine.postcode || '',
        coordinates: newMachine.coordinates || '',
        type: newMachine.type ?? '',
        status: newMachine.status ?? '',
        ownerId: newMachine.ownerId || newMachine.owner || '',
        collectorId: newMachine.collectorId || newMachine.collector || '',
        technicianId: newMachine.technicianId || newMachine.technician || '',
        manufacturedDate: newMachine.manufacturedDate,
        manufacturedDateDisplay: toLocalDateString(newMachine.manufacturedDate)
      }
    } else {
      formData.value = {
        deviceId: '',
        name: '',
        unitNo: '',
        street: '',
        country: '',
        state: '',
        district: '',
        postcode: '',
        coordinates: '',
        type: '',
        status: '',
        ownerId: '',
        collectorId: '',
        technicianId: '',
        manufacturedDate: '',
      }
    }
  },
  { immediate: true },
);

watch(
  () => formData.value.deviceId,
  (newMachineId) => {
    if (!newMachineId) {
      return;
    }

    const selected = props.unassignedMachines?.find(
      (m) => m.machineId === newMachineId
    );

    if (selected?.createdAt) {
      // Save full ISO datetime (for backend)
      formData.value.manufacturedDate = selected.createdAt;

      // Show only local date in form
      formData.value.manufacturedDateDisplay = toLocalDateString(selected.createdAt);
    }
      else if (formData.value.manufacturedDate) {
      formData.value.manufacturedDateDisplay = toLocalDateString(formData.value.manufacturedDate);
    }
  }
);

// Filter dropdowns
const filteredStates = computed(() =>
console.log(props.states) ||
  props.states.filter((s) => s.country === formData.value.country)
  .map((s) => s.value)
);
const filteredDistricts = computed(() =>
  props.districts.filter((d) => d.state === formData.value.state)
  .map((s) => s.value)
);

const toLocalDateString = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  // Adjust to local timezone by subtracting the offset
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  // Now convert to local ISO string and truncate date
  return localDate.toISOString().split('T')[0];
};

function handleSubmit() {
  emit("save", { ...formData.value });
};

function openMap() {
  emit("openMap");
}
</script>
