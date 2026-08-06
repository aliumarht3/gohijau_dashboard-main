<template>
  <span class="relative inline-flex items-center group">
    <svg
      class="w-3.5 h-3.5 text-gray-400 hover:text-gray-500 cursor-help shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clip-rule="evenodd"
      />
    </svg>

    <!-- Tooltip bubble -->
    <span
      class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-md bg-gray-800 px-2.5 py-1.5 text-xs text-white leading-snug opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50 text-center shadow-lg"
    >
      {{ text }}
      <!-- Arrow -->
      <span
        class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
      />
    </span>
  </span>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
})
</script>
