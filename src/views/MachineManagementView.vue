<template>
  <DashboardLayout>
    <Card class="mt-4">
      <h2 class="text-xl font-semibold mb-4">Machine Management</h2>

      <!-- Table -->
      <MachineTable
        :machines="machines"
        :owners="owners"
        :ownerUsers="ownerUsers"
        @create="openCreateModal"
        @edit="openEditModal"
        @delete="deleteMachine"
        @view-history="openHistoryModal"
      />
    </Card>

    <!-- Form Modal -->
    <MachineFormModal
      :show="showModal"
      :machine="selectedMachine"
      :countries="countries"
      :states="states"
      :coordinates="selectedCoords"
      :districts="districts"
      :owners="owners"
      :types="types"
      :statuses="statuses"
      :unassignedMachines="unassignedMachines"
      :collectors="collectors"
      :technicians="technicians"
      @close="closeModal"
      @save="saveMachine"
      @openMap="openMapPicker"
    />
    <MapPicker
      :show="showMap"
      :initialCoords="selectedCoords"
      @close="showMap = false"
      @select="setCoordinates"
    />
    
    <!-- History Modal -->
    <MachineHistoryModal
      :show="showHistoryModal"
      :machine="selectedHistoryMachine"
      @close="closeHistoryModal"
    />
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/layouts/dashboard_template.vue";
import Card from "@/components/Card.vue";
import MachineTable from "@/components/MachineTable.vue";
import MachineFormModal from "@/components/MachineFormModal.vue";
import MapPicker from "@/components/MapPicker.vue";
import MachineHistoryModal from "@/components/MachineHistoryModal.vue";
import { ref, onMounted,onUnmounted } from "vue";
import api from '@/lib/apiClient'
import { startConnection, onMessage, stopConnection } from "@/services/signalRService";
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
const userRole = userStore.user?.userRole;

const machines = ref([]);
const unassignedMachines = ref([]);
const loading = ref(true);
const error = ref(null);
const owners = ref([])
const ownerUsers = ref([])
const collectors = ref([])
const technicians = ref([])
const statusTimers = {};
const INACTIVE_TIMEOUT_MS = 30000;
onMounted(async () => {
  try {
    fetchMachines();
    fetchUnassignedMachines();
    const collectorsRes = await api.get('/api/organization/oilCollectors');
    collectors.value = collectorsRes.data;
    const ownersRes = await api.get('/api/organization/owners');
    owners.value = ownersRes.data;
    const ownerUserResults = await Promise.all(
      owners.value.map((org) => api.get(`/api/user/by-organization/${org.id}`).then(r => r.data).catch(() => []))
    );
    ownerUsers.value = ownerUserResults.flat();
    const techniciansRes = await api.get('/api/organization/technicians');
    technicians.value = techniciansRes.data;
    await startConnection("https://services.gohijau.org/machineHub");
    onMessage("ReceiveStatus", (machineId, status) => {
    console.log("📡 Status update:", machineId, status);
    const machine = machines.value.find((m) => m.deviceId === machineId);
     if (!machine) return;

    // 1️⃣ Update the status immediately
    machine.activeStatus = status === "Active" ? "Active" : "Inactive";

    // 2️⃣ Clear old timeout
    if (statusTimers[machineId]) clearTimeout(statusTimers[machineId]);

    // 3️⃣ Start new inactivity timer if machine is active
    if (status === "Active") {
      statusTimers[machineId] = setTimeout(() => {
        console.log(`⏳ ${machineId} inactive timeout`);
        const m = machines.value.find(x => x.deviceId === machineId);
        if (m) m.activeStatus = "Inactive";
      }, INACTIVE_TIMEOUT_MS);
    }
  });
  } catch (err) {
    console.error("Failed to fetch machines:", err);
    error.value = "Could not load machines.";
  } finally {
    loading.value = false;
  }
});
onUnmounted(() => stopConnection());
// Dropdown datasets
const countries = ["Malaysia", "Singapore"];
const states = [
  { country: "Malaysia", value: "Johor" },
  { country: "Malaysia", value: "Kedah" },
  { country: "Malaysia", value: "Kelantan" },
  { country: "Malaysia", value: "Melaka" },
  { country: "Malaysia", value: "Negeri Sembilan" },
  { country: "Malaysia", value: "Pahang" },
  { country: "Malaysia", value: "Penang" },
  { country: "Malaysia", value: "Perak" },
  { country: "Malaysia", value: "Perlis" },
  { country: "Malaysia", value: "Selangor" },
  { country: "Malaysia", value: "Terengganu" },
  { country: "Malaysia", value: "Sabah" },
  { country: "Malaysia", value: "Sarawak" },
  { country: "Malaysia", value: "Kuala Lumpur" },
  { country: "Malaysia", value: "Putrajaya" },
  { country: "Malaysia", value: "Labuan" },
  { country: "Singapore", value: "Central" },
  { country: "Singapore", value: "East" },
  { country: "Singapore", value: "North" },
  { country: "Singapore", value: "North-East" },
  { country: "Singapore", value: "West" },
];

const districts = [
  { state: "Johor", value: "Johor Bahru" },
  { state: "Johor", value: "Muar" },
  { state: "Johor", value: "Batu Pahat" },
  { state: "Johor", value: "Kluang" },
  { state: "Johor", value: "Pontian" },
  { state: "Johor", value: "Kulai" },
  { state: "Johor", value: "Kota Tinggi" },
  { state: "Johor", value: "Mersing" },
  { state: "Johor", value: "Segamat" },
  { state: "Johor", value: "Tangkak" },  
  { state: "Kedah", value: "Alor Setar" },
  { state: "Kedah", value: "Sungai Petani" },
  { state: "Kedah", value: "Kulim" },
  { state: "Kedah", value: "Langkawi" },
  { state: "Kedah", value: "Baling" },
  { state: "Kedah", value: "Kubang Pasu" },
  { state: "Kedah", value: "Kuala Muda" },
  { state: "Kedah", value: "Padang Terap" },
  { state: "Kedah", value: "Pendang" },
  { state: "Kedah", value: "Yan" },
  { state: "Kelantan", value: "Kota Bharu" },
  { state: "Kelantan", value: "Pasir Mas" },
  { state: "Kelantan", value: "Tanah Merah" },
  { state: "Kelantan", value: "Machang" },
  { state: "Kelantan", value: "Pasir Puteh" },
  { state: "Kelantan", value: "Tumpat" },
  { state: "Kelantan", value: "Bachok" },
  { state: "Kelantan", value: "Kuala Krai" },
  { state: "Kelantan", value: "Gua Musang" },
  { state: "Kelantan", value: "Jeli" },
  { state: "Melaka", value: "Melaka Tengah" },
  { state: "Melaka", value: "Alor Gajah" },
  { state: "Melaka", value: "Jasin" },
  { state: "Negeri Sembilan", value: "Seremban" },
  { state: "Negeri Sembilan", value: "Port Dickson" },
  { state: "Negeri Sembilan", value: "Rembau" },
  { state: "Negeri Sembilan", value: "Tampin" },
  { state: "Negeri Sembilan", value: "Kuala Pilah" },
  { state: "Negeri Sembilan", value: "Jempol" },
  { state: "Negeri Sembilan", value: "Jelebu" },
  { state: "Pahang", value: "Kuantan" },
  { state: "Pahang", value: "Temerloh" },
  { state: "Pahang", value: "Bentong" },
  { state: "Pahang", value: "Raub" },
  { state: "Pahang", value: "Jerantut" },
  { state: "Pahang", value: "Pekan" },
  { state: "Pahang", value: "Kuala Lipis" },
  { state: "Pahang", value: "Rompin" },
  { state: "Pahang", value: "Maran" },
  { state: "Pahang", value: "Bera" },
  { state: "Pahang", value: "Cameron Highlands" },
  { state: "Penang", value: "George Town" },
  { state: "Penang", value: "Seberang Perai Utara" },
  { state: "Penang", value: "Seberang Perai Tengah" },
  { state: "Penang", value: "Seberang Perai Selatan" },
  { state: "Penang", value: "Bayan Lepas" },
  { state: "Perak", value: "Ipoh" },
  { state: "Perak", value: "Taiping" },
  { state: "Perak", value: "Teluk Intan" },
  { state: "Perak", value: "Kampar" },
  { state: "Perak", value: "Kuala Kangsar" },
  { state: "Perak", value: "Manjung" },
  { state: "Perak", value: "Tanjung Malim" },
  { state: "Perak", value: "Parit Buntar" },
  { state: "Perak", value: "Batu Gajah" },
  { state: "Perak", value: "Seri Iskandar" },
  { state: "Perak", value: "Tapah" },
  { state: "Perak", value: "Gerik" }, 
  { state: "Perlis", value: "Kangar" },
  { state: "Perlis", value: "Arau" },
  { state: "Perlis", value: "Padang Besar" },
  { state: "Selangor", value: "Petaling" },
  { state: "Selangor", value: "Shah Alam" },
  { state: "Selangor", value: "Subang Jaya" },
  { state: "Selangor", value: "Klang" },
  { state: "Selangor", value: "Gombak" },
  { state: "Selangor", value: "Hulu Langat" },
  { state: "Selangor", value: "Kuala Selangor" },
  { state: "Selangor", value: "Sepang" },
  { state: "Selangor", value: "Kuala Langat" },
  { state: "Selangor", value: "Sabak Bernam" },
  { state: "Selangor", value: "Rawang" },
  { state: "Selangor", value: "Ampang" },
  { state: "Selangor", value: "Puchong" },
  { state: "Terengganu", value: "Kuala Terengganu" },
  { state: "Terengganu", value: "Kemaman" },
  { state: "Terengganu", value: "Dungun" },
  { state: "Terengganu", value: "Besut" },
  { state: "Terengganu", value: "Setiu" },
  { state: "Terengganu", value: "Hulu Terengganu" },
  { state: "Terengganu", value: "Marang" },
  { state: "Terengganu", value: "Kuala Nerus" },
  { state: "Sabah", value: "Kota Kinabalu" },
  { state: "Sabah", value: "Sandakan" },
  { state: "Sabah", value: "Tawau" },
  { state: "Sabah", value: "Lahad Datu" },
  { state: "Sabah", value: "Keningau" },
  { state: "Sabah", value: "Putatan" },
  { state: "Sabah", value: "Donggongon" },
  { state: "Sabah", value: "Semporna" },
  { state: "Sabah", value: "Kudat" },
  { state: "Sabah", value: "Papar" },
  { state: "Sabah", value: "Ranau" },
  { state: "Sabah", value: "Beaufort" },
  { state: "Sabah", value: "Kinarut" },
  { state: "Sabah", value: "Kunak" },
  { state: "Sabah", value: "Tuaran" },
  { state: "Sarawak", value: "Kuching" },
  { state: "Sarawak", value: "Miri" },
  { state: "Sarawak", value: "Sibu" },
  { state: "Sarawak", value: "Bintulu" },
  { state: "Sarawak", value: "Limbang" },
  { state: "Sarawak", value: "Sarikei" },
  { state: "Sarawak", value: "Sri Aman" },
  { state: "Sarawak", value: "Kapit" },
  { state: "Sarawak", value: "Samarahan" },
  { state: "Sarawak", value: "Betong" },
  { state: "Sarawak", value: "Mukah" },
  { state: "Sarawak", value: "Lawas" },
  { state: "Kuala Lumpur", value: "Bukit Bintang" },
  { state: "Kuala Lumpur", value: "Cheras" },
  { state: "Kuala Lumpur", value: "Bangsar" },
  { state: "Kuala Lumpur", value: "Kepong" },
  { state: "Kuala Lumpur", value: "Titiwangsa" },
  { state: "Kuala Lumpur", value: "Setapak" },
  { state: "Kuala Lumpur", value: "Wangsa Maju" },
  { state: "Kuala Lumpur", value: "Sentul" },
  { state: "Kuala Lumpur", value: "Brickfields" },
  { state: "Kuala Lumpur", value: "Damansara" },
  { state: "Kuala Lumpur", value: "Seputeh" },
  { state: "Putrajaya", value: "Precinct 1" },
  { state: "Putrajaya", value: "Precinct 2" },
  { state: "Putrajaya", value: "Precinct 4" },
  { state: "Putrajaya", value: "Precinct 8" },
  { state: "Putrajaya", value: "Precinct 9" },
  { state: "Putrajaya", value: "Precinct 11" },
  { state: "Putrajaya", value: "Precinct 14" },
  { state: "Putrajaya", value: "Precinct 16" },
  { state: "Putrajaya", value: "Precinct 18" },
  { state: "Labuan", value: "Victoria" },
  { state: "Labuan", value: "Financial Park" },
  { state: "Central", value: "Downtown Core" },
  { state: "Central", value: "Marina South" },
  { state: "Central", value: "Orchard" },
  { state: "East", value: "Bedok" },
  { state: "East", value: "Tampines" },
  { state: "East", value: "Pasir Ris" },
  { state: "North", value: "Woodlands" },
  { state: "North", value: "Yishun" },
  { state: "North", value: "Sembawang" },
  { state: "North-East", value: "Hougang" },
  { state: "North-East", value: "Punggol" },
  { state: "North-East", value: "Sengkang" },
  { state: "West", value: "Jurong" },
  { state: "West", value: "Choa Chu Kang" },
  { state: "West", value: "Bukit Batok" },
];
const types = ['UCO_COLLECTOR']
const statuses = ['DEPLOYED']

const showModal = ref(false);
const selectedMachine = ref(null);
const showMap = ref(false);
const selectedCoords = ref("");
const showHistoryModal = ref(false);
const selectedHistoryMachine = ref(null);

function openCreateModal() {
  selectedMachine.value = null;
  showModal.value = true;
}

async function fetchMachines() {
  // Use different endpoint based on user role
  const endpoint = userRole === 'Owner' ? '/api/machine/owner' : '/api/machine/all';
  const res = await api.get(endpoint);
  const machineCapacity = userRole === 'Owner' ? '/api/UCOTracking/get-owner' : '/api/UCOTracking/get-all';
  const capacityRes = await api.get(machineCapacity);
  // assuming API returns an array of machines
  res.data.forEach((m) => {
    m.deviceId = m.machineId
    if (m.location) {
      m.name = m.location.name
      m.unitNo = m.location.unitNo
      m.street = m.location.street
      m.district = m.location.district
      m.postcode = m.location.postcode
      m.state = m.location.state
      m.country = m.location.country
      m.coordinates = m.location.coordinates
    }
    m.capacity = capacityRes.data.find((c) => c.machineId === m.machineId)?.bufferVolume || ""
  })
  machines.value = res.data
}

async function fetchUnassignedMachines() {
  const res = await api.get('/api/machine/unassigned');
  unassignedMachines.value = res.data;
}

function openEditModal(machine) {
  selectedMachine.value = {
    id: machine.id,
    deviceId: machine.machineId, // or machine.deviceId depending on backend
    name: machine.name,
    unitNo: machine.location?.unitNo || "",
    street: machine.location?.street || "",
    district: machine.location?.district || "",
    state: machine.location?.state || "",
    country: machine.location?.country || "",
    postcode: machine.location?.postcode || "",
    coordinates: machine.location?.coordinates || "",
    type: machine.type,
    status: machine.status,
    owner: machine.owner,
    collector: machine.collector,
    technician: machine.technician,
    manufacturedDate: machine.manufacturedDate,
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveMachine(data) {
  if (data.id) {
    // edit existing
    try {
      const payload = {
      machineId: data.deviceId,
        location: {
          name: data.name,
          unitNo: data.unitNo,
          street: data.street,
          district: data.district,
          postcode: data.postcode,
          state: data.state,
          country: data.country,
          coordinates: data.coordinates
        },
        type: 0, // map from your "Recycler" string -> backend enum
        status: 0, // map from "Active" -> 0
        owner: data.ownerId ? String(data.ownerId) : "",
        collector: data.collectorId ? String(data.collectorId) : '',
        technician: data.technicianId ? String(data.technicianId) : '',
      }
      await api.patch(`/api/machine/update/${data.id}`, payload)
    } catch (err) {
      console.error("Failed to update machine:", err);
    }
  } else {
    const payload = {
      machineId: data.deviceId,
      location: {
        name: data.name,
        unitNo: data.unitNo,
        street: data.street,
        district: data.district,
        postcode: data.postcode,
        state: data.state,
        country: data.country,
        coordinates: data.coordinates
      },
      type: 0, // map from your "Recycler" string -> backend enum
      manufacturedDate: data.manufacturedDate,
      status: 0, // map from "Active" -> 0
      owner: data.ownerId ? String(data.ownerId) : "",
      collector: data.collectorId ? String(data.collectorId) : '',
      technician: data.technicianId ? String(data.technicianId) : '',
    }
    try {
      await api.post('/api/machine/create', payload)
    } catch (err) {
      console.error("Failed to create machine:", err);
      alert(`Failed to create machine.\n\n${err.response?.data?.error || err.response?.data?.message || err.response?.data?.title || err.message || err}`);
      return;
    }
  }
  fetchMachines();
  fetchUnassignedMachines();
  closeModal();
}

async function deleteMachine(machine) {
  if (confirm("Delete " + machine.machineId + "?")) {
    try {
      await api.delete(`/api/machine/delete/${machine.id}`);
      fetchMachines();
    } catch (err) {
      console.error("Failed to delete machine:", err);
      alert("Failed to delete machine. Please try again.");
    }
  }
}

function openMapPicker() {
  selectedCoords.value = selectedMachine.value?.coordinates || "";
  showMap.value = true;
}

function setCoordinates(coords) {
  if (selectedMachine.value) {
    selectedMachine.value.coordinates = coords;
  }
  // Force update MachineFormModal via prop reactivity
  selectedCoords.value = coords;
}

function openHistoryModal(machine) {
  selectedHistoryMachine.value = machine;
  showHistoryModal.value = true;
}

function closeHistoryModal() {
  showHistoryModal.value = false;
  selectedHistoryMachine.value = null;
}
</script>
