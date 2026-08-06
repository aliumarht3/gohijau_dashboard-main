<template>
  <div class="relative">
    <input
      v-model="search"
      type="text"
      :placeholder="placeholder"
      class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
      @focus="open = true"
      @blur="closeDropdown"
    />

    <div
      v-if="open"
      class="absolute z-50 bg-white border border-gray-200 rounded mt-1 w-full max-h-40 overflow-y-auto shadow"
    >
      <div
        v-for="option in filteredOptions"
        :key="optionValue ? option[optionValue] : option"
        @mousedown.prevent="selectOption(option)"
        class="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
      >
        {{ optionLabel ? option[optionLabel] : option }}
      </div>
      <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-500 text-sm">
        No results
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch,computed } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  optionLabel: String, // key for label
  optionValue: String, // key for value
  placeholder: { type: String, default: "Select..." },
});

const emit = defineEmits(["update:modelValue"]);

const search = ref("");
const open = ref(false);

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      search.value = "";
      return;
    }

    // find matching option
    const option = props.optionValue
      ? props.options.find((o) => o[props.optionValue] === newVal)
      : props.options.find((o) => o === newVal);

    if (option) {
      search.value = props.optionLabel ? option[props.optionLabel] : option;
    }
  },
  { immediate: true }
);
const filteredOptions = computed(() =>
  props.options.filter((opt) => {
    const label = props.optionLabel ? opt[props.optionLabel] : opt;
    return label.toLowerCase().includes(search.value.toLowerCase());
  })
);

function selectOption(option) {
  const value = props.optionValue ? option[props.optionValue] : option;
  const label = props.optionLabel ? option[props.optionLabel] : option;
  emit("update:modelValue", value);
  search.value = label; // show label in input
  open.value = false;
}

function closeDropdown() {
  setTimeout(() => {
    open.value = false;
  }, 150);
}
</script>
