<template>
<router-link :to="to" class="flex items-center px-4 py-2 hover:bg-gray-100">
  <component :is="iconComponent" class="w-5 h-5 text-gray-600" />
  <span v-if="!collapsed" class="ml-3 text-gray-700 font-medium">{{ label }}</span>
</router-link>
</template>

<script setup>
import { computed } from 'vue';
import { HomeIcon, UserIcon, ServerStackIcon, TruckIcon, ScaleIcon, ClockIcon, BuildingOffice2Icon, ChartBarIcon, WrenchScrewdriverIcon, ClipboardDocumentCheckIcon} from '@heroicons/vue/24/solid';
import { useSidebarStore } from '@/stores/sidebar';

const props = defineProps({
  icon: String,
  label: String,
  to: String,
  collapsed: Boolean,
});

const iconComponent = computed(() => {
  switch (props.icon) {
    case 'home': return HomeIcon;
    case 'user': return UserIcon;
    case 'machine': return ServerStackIcon;
    case 'truck': return TruckIcon;
    case 'scale': return ScaleIcon;
    case 'history': return ClockIcon;
    case 'building': return BuildingOffice2Icon;
    case 'chart-bar': return ChartBarIcon;
    case 'wrench': return WrenchScrewdriverIcon;
    case 'clipboard-check': return ClipboardDocumentCheckIcon
    default: return HomeIcon;
  }
});
</script>
