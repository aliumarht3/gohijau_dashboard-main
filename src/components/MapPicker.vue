<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl h-[500px] p-4 relative">
      <h2 class="text-lg font-semibold mb-2">Select Location</h2>

      <input
        ref="searchInput"
        type="text"
        placeholder="Search location..."
        class="w-full border rounded px-3 py-2 mb-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <!-- Map Container -->
      <div v-if="mapError" class="w-full h-[400px] rounded border flex items-center justify-center bg-red-50 text-red-600 text-sm px-4 text-center">
        {{ mapError }}
      </div>
      <div v-else ref="mapRef" class="w-full h-[400px] rounded border"></div>

      <!-- Actions -->
      <div class="flex justify-end space-x-2 mt-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          @click="confirmSelection"
          class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Location
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  show: Boolean,
  initialCoords: { type: String, default: '' }, // "lat,lng"
})

const emit = defineEmits(['close', 'select'])

const mapRef = ref(null)
const searchInput = ref(null)
const mapError = ref(null)
let map, marker, autocomplete

// Poll until window.google is available, then resolve
function waitForGoogle(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve()
    const start = Date.now()
    const id = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(id)
        resolve()
      } else if (Date.now() - start > timeout) {
        clearInterval(id)
        reject(new Error('Google Maps failed to load within 10 seconds.'))
      }
    }, 100)
  })
}

// Load map when modal opens
watch(
  () => props.show,
  async (newVal) => {
    if (!newVal) return
    await nextTick()
    mapError.value = null
    try {
      await waitForGoogle()
      initMap()
    } catch (e) {
      mapError.value = e.message
    }
  },
)

function initMap() {
  if (!mapRef.value) return

  const [lat, lng] = props.initialCoords
    ? props.initialCoords.split(',').map(Number)
    : [3.139, 101.6869] // Default: Kuala Lumpur

  const center = { lat, lng }

  map = new google.maps.Map(mapRef.value, {
    center,
    zoom: 12,
    mapId: 'DEMO_MAP_ID',
  })

  marker = new google.maps.marker.AdvancedMarkerElement({
    position: center,
    map,
    gmpDraggable: true,
  })

  // Update marker position on map click
  map.addListener('click', (e) => {
    marker.position = e.latLng
  })

  autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
    fields: ['geometry', 'name'],
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.geometry?.location) return

    const location = place.geometry.location
    map.panTo(location)
    map.setZoom(15)
    // AdvancedMarkerElement uses .position property — no .setPosition()
    marker.position = location
  })
}

function confirmSelection() {
  const pos = marker.position
  const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat
  const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng

  emit('select', `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
  emit('close')
}
</script>
