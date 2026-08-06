<template>
  <DashboardLayout>
    <!-- Organization List View -->
    <Card v-if="!selectedOrg" class="mt-4">
      <h2 class="text-xl font-semibold mb-4">Organization Management</h2>
      <OrganizationTable
        :organizations="organizations"
        :loadingId="orgLoadingId"
        :canCreate="isAdmin"
        :canDelete="isAdmin"
        @create="openCreateOrgModal"
        @view="viewOrganization"
        @edit="openEditOrgModal"
        @delete="handleDeleteOrganization"
      />
    </Card>

    <!-- Organization Detail View (after selecting an org) -->
    <div v-else>
      <!-- Back button + Org name -->
      <div class="flex items-center gap-3 mt-4 mb-4">
        <button
          @click="goBackToList"
          class="flex items-center gap-1 text-sm text-gray-600 hover:text-green-700 font-medium"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Organizations
        </button>
      </div>

      <!-- Organization Info Card -->
      <Card class="mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ selectedOrg.organizationName }}</h2>
            <p class="text-sm text-gray-500 mt-1">{{ formatAddress(selectedOrg.address) }}</p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="isAdmin"
              @click="openAddDebtModal(selectedOrg)"
              class="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600"
            >
              Add Debt
            </button>
            <button
              @click="openEditOrgModal(selectedOrg)"
              class="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
            >
              Edit Organization
            </button>
          </div>
        </div>

        <!-- Summary info -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div v-if="selectedOrg.collectorRate != null">
            <p class="text-xs text-gray-500 uppercase tracking-wider">Collector Rate</p>
            <p class="text-sm font-semibold text-gray-800">{{ selectedOrg.collectorRate }}</p>
          </div>
          <div v-if="selectedOrg.profitRate != null">
            <p class="text-xs text-gray-500 uppercase tracking-wider">Profit Rate</p>
            <p class="text-sm font-semibold text-gray-800">{{ selectedOrg.profitRate }}</p>
          </div>
          <div v-if="selectedOrg.customerRate != null">
            <p class="text-xs text-gray-500 uppercase tracking-wider">Customer Rate</p>
            <p class="text-sm font-semibold text-gray-800">{{ selectedOrg.customerRate }}</p>
          </div>
          <div v-if="selectedOrg.creditLimit != null">
            <p class="text-xs text-gray-500 uppercase tracking-wider">Credit Limit</p>
            <p class="text-sm font-semibold text-gray-800">RM {{ selectedOrg.creditLimit.toFixed(2) }}</p>
          </div>
          <div v-if="selectedOrg.totalDebtAssigned != null">
            <p class="text-xs text-gray-500 uppercase tracking-wider">Outstanding / Total Debt</p>
            <p class="text-sm font-semibold text-gray-800">RM {{ selectedOrg.outstandingDebt.toFixed(2) }} / RM {{ selectedOrg.totalDebtAssigned.toFixed(2) }}</p>
          </div>
          <div v-if="selectedOrg.certificatePath">
            <p class="text-xs text-gray-500 uppercase tracking-wider">Certificate</p>
            <a
              :href="`${baseURL}${selectedOrg.certificatePath}`"
              target="_blank"
              class="text-sm text-green-600 underline hover:text-green-700"
            >
              View Document
            </a>
          </div>
        </div>
      </Card>

      <!-- Collector Employees Section -->
      <Card v-if="showCollectorEmployees" class="mb-4">
        <EmployeeTable
          :employees="collectorEmployees"
          title="Oil Collectors"
          employeeType="Collector"
          :loadingId="empLoadingId"
          @add="openAddCollectorModal"
          @edit="openEditEmployeeModal"
          @remove="removeEmployee"
        />
      </Card>

      <!-- Technician Employees Section -->
      <Card v-if="showTechnicianEmployees">
        <EmployeeTable
          :employees="technicianEmployees"
          title="Technicians"
          employeeType="Technician"
          :loadingId="empLoadingId"
          @add="openAddTechnicianModal"
          @edit="openEditEmployeeModal"
          @remove="removeEmployee"
        />
      </Card>
    </div>

    <!-- Organization Form Modal (Create / Edit / View) -->
    <OrganizationFormModal
      :show="showOrgModal"
      :organization="editingOrg"
      :mode="orgModalMode"
      :userRole="userRole"
      :saving="isSavingOrg"
      @close="closeOrgModal"
      @save="saveOrganization"
    />

    <AddDebtModal
      :show="showAddDebtModal"
      :organization="selectedOrg"
      @close="closeAddDebtModal"
      @save="saveDebt"
    />

    <!-- Employee Form Modal (Add / Edit collector or technician) -->
    <EmployeeFormModal
      :show="showEmpModal"
      :employee="editingEmployee"
      :employeeType="currentEmployeeRoleId === 5 ? 'Collector' : 'Technician'"
      :organizationId="selectedOrg?.id || ''"
      :roleId="currentEmployeeRoleId"
      @close="closeEmpModal"
      @save="saveEmployee"
    />

    <!-- Toast notification -->
    <transition name="toast">
      <div
        v-if="toast.visible"
        :class="[
          'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600',
        ]"
      >
        <svg v-if="toast.type === 'success'" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ toast.message }}
      </div>
    </transition>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/layouts/dashboard_template.vue'
import Card from '@/components/Card.vue'
import OrganizationTable from '@/components/OrganizationTable.vue'
import OrganizationFormModal from '@/components/OrganizationFormModal.vue'
import AddDebtModal from '@/components/AddDebtModal.vue'
import EmployeeTable from '@/components/EmployeeTable.vue'
import EmployeeFormModal from '@/components/EmployeeFormModal.vue'
import { useUserStore } from '@/stores/userStore'
import { baseURL } from '@/lib/apiClient'
import {
  fetchAllOrganizations,
  fetchOrganizationById,
  createOrganization,
  updateOrganization,
  addOrganizationDebt,
  deleteOrganization,
  fetchEmployeesByOrganization,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/services/organizationService'

// ─── User Store & Role ──────────────────────────────────────────────────────────

const userStore = useUserStore()
const userRole = computed(() => userStore.user?.userRole || '')
const userOrgId = computed(() => userStore.user?.organizationId || '')

const isAdmin = computed(() => ['Admin', 'GoHijauOwner'].includes(userRole.value))

// ─── Organization State ─────────────────────────────────────────────────────────

const organizations = ref([])
const orgLoadingId = ref(null)
const isSavingOrg = ref(false)
const showOrgModal = ref(false)
const editingOrg = ref(null)
const orgModalMode = ref('create') // 'create' | 'edit' | 'view'
const selectedOrg = ref(null) // currently viewing org detail page
const showAddDebtModal = ref(false)

// ─── Employee State ─────────────────────────────────────────────────────────────

const employees = ref([])
const empLoadingId = ref(null)
const isSavingEmp = ref(false)
const showEmpModal = ref(false)
const editingEmployee = ref(null)
const currentEmployeeRoleId = ref(null) // 4 for Technician, 5 for Collector

// Organization type constants
const ORG_TYPE_COLLECTOR = 1    // Oil Collector → shows Collector employee section
const ORG_TYPE_MACHINE_OWNER = 2 // Machine Owner → shows Technician employee section

// Helper to check if org has a specific type
const hasOrgType = (typeId) => {
  if (!selectedOrg.value?.organizationTypes) return false
  return selectedOrg.value.organizationTypes.includes(typeId)
}

// Determine which employee segments to show based on organization type
const showCollectorEmployees = computed(() => hasOrgType(ORG_TYPE_COLLECTOR))
const showTechnicianEmployees = computed(() => hasOrgType(ORG_TYPE_MACHINE_OWNER))

// ─── Lifecycle ──────────────────────────────────────────────────────────────────

onMounted(async () => {
  await loadOrganizations()
})

// ─── Organization Methods ───────────────────────────────────────────────────────

async function loadOrganizations() {
  try {
    if (!isAdmin.value && userOrgId.value) {
      // Non-admin: fetch only their own org
      const org = await fetchOrganizationById(userOrgId.value)
      organizations.value = org ? [org] : []
      if (organizations.value.length === 1) {
        await viewOrganization(organizations.value[0])
      }
    } else {
      organizations.value = await fetchAllOrganizations()
    }
  } catch (err) {
    console.error('Failed to fetch organizations:', err)
  }
}

async function viewOrganization(org) {
  selectedOrg.value = { ...org }
  await loadEmployees(org.id)
}

function goBackToList() {
  selectedOrg.value = null
  employees.value = []
}

function openCreateOrgModal() {
  editingOrg.value = null
  orgModalMode.value = 'create'
  showOrgModal.value = true
}

function openEditOrgModal(org) {
  editingOrg.value = { ...org }
  orgModalMode.value = 'edit'
  showOrgModal.value = true
}

function closeOrgModal() {
  showOrgModal.value = false
  editingOrg.value = null
}

function openAddDebtModal(org) {
  editingOrg.value = { ...org }
  showAddDebtModal.value = true
}

function closeAddDebtModal() {
  showAddDebtModal.value = false
  editingOrg.value = null
}

async function saveOrganization({ mode, formData, certificateFile }) {
  isSavingOrg.value = true
  try {
    if (mode === 'create') {
      const debt = Number(formData.debt ?? 0)
      if (debt < 0) {
        alert('Debt cannot be negative.')
        return
      }
    }

    if (mode === 'edit') {
      await updateOrganization(formData.id, formData, certificateFile)
    } else {
      await createOrganization(formData, certificateFile)
    }
    await loadOrganizations()
    if (selectedOrg.value?.id === formData.id) {
      const refreshed = organizations.value.find((o) => o.id === formData.id)
      if (refreshed) selectedOrg.value = { ...refreshed }
    }
    showToast(mode === 'edit' ? 'Organization updated successfully.' : 'Organization created successfully.', 'success')
    closeOrgModal()
  } catch (err) {
    console.error('Failed to save organization:', err)
    showToast(err.response?.data?.message || 'Failed to save organization. Please try again.', 'error')
  } finally {
    isSavingOrg.value = false
  }
}

async function saveDebt({ debtIncrement }) {
  if (!selectedOrg.value?.id) return
  if (debtIncrement <= 0) {
    alert('Add Debt Amount must be greater than 0.')
    return
  }

  try {
    await addOrganizationDebt(selectedOrg.value.id, debtIncrement)
    const refreshed = await fetchOrganizationById(selectedOrg.value.id)
    if (refreshed) {
      selectedOrg.value = { ...refreshed }
      const idx = organizations.value.findIndex((o) => o.id === refreshed.id)
      if (idx !== -1) organizations.value[idx] = { ...refreshed }
    }
    closeAddDebtModal()
  } catch (err) {
    console.error('Failed to add debt:', err)
    alert('Failed to add debt. Please try again.')
  }
}

async function handleDeleteOrganization(org) {
  if (!confirm(`Delete "${org.organizationName}"? This action cannot be undone.`)) return

  orgLoadingId.value = org.id
  try {
    await deleteOrganization(org.id)
    await loadOrganizations()
    showToast(`"${org.organizationName}" deleted successfully.`, 'success')
  } catch (err) {
    console.error('Failed to delete organization:', err)
    showToast(err.response?.data?.message || 'Failed to delete organization. Please try again.', 'error')
  } finally {
    orgLoadingId.value = null
  }
}

// ─── Employee Methods ───────────────────────────────────────────────────────────

async function loadEmployees(orgId) {
  try {
    employees.value = await fetchEmployeesByOrganization(orgId)
  } catch (err) {
    console.error('Failed to fetch employees:', err)
  }
}

// Computed to filter employees by role
const collectorEmployees = computed(() =>
  employees.value.filter((e) => e.roles?.includes(5)),
)

const technicianEmployees = computed(() =>
  employees.value.filter((e) => e.roles?.includes(4)),
)

function openAddCollectorModal() {
  editingEmployee.value = null
  currentEmployeeRoleId.value = 5 // Collector role
  showEmpModal.value = true
}

function openAddTechnicianModal() {
  editingEmployee.value = null
  currentEmployeeRoleId.value = 4 // Technician role
  showEmpModal.value = true
}

function openEditEmployeeModal(emp) {
  editingEmployee.value = { ...emp }
  showEmpModal.value = true
}

function closeEmpModal() {
  showEmpModal.value = false
  editingEmployee.value = null
}

async function saveEmployee({ mode, formData }) {
  isSavingEmp.value = true
  try {
    if (mode === 'edit') {
      await updateEmployee({
        userId: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nricOrPassport: formData.nricOrPassport,
        organizationId: formData.organizationId,
        roleId: formData.rolesId,
      })
    } else {
      await createEmployee({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nricOrPassport: formData.nricOrPassport,
        organizationId: formData.organizationId,
        roleId: formData.rolesId,
      })
    }
    await loadEmployees(selectedOrg.value.id)
    showToast(mode === 'edit' ? `${employeeTypeName.value} updated successfully.` : `${employeeTypeName.value} added successfully.`, 'success')
    closeEmpModal()
  } catch (err) {
    console.error('Failed to save employee:', err)
    showToast(err.response?.data?.message || `Failed to save ${employeeTypeName.value.toLowerCase()}. Please try again.`, 'error')
  } finally {
    isSavingEmp.value = false
  }
}

async function removeEmployee(emp) {
  if (!confirm(`Remove ${emp.name} from this organization?`)) return

  empLoadingId.value = emp.id
  try {
    await deleteEmployee(emp.email)
    await loadEmployees(selectedOrg.value.id)
    showToast(`${emp.name} removed successfully.`, 'success')
  } catch (err) {
    console.error('Failed to remove employee:', err)
    showToast(err.response?.data?.message || 'Failed to remove employee. Please try again.', 'error')
  } finally {
    empLoadingId.value = null
  }
}

// ─── Toast ──────────────────────────────────────────────────────────────────────

const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimer = null

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { visible: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.visible = false
  }, 3500)
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const employeeTypeName = computed(() =>
  currentEmployeeRoleId.value === 5 ? 'Collector' : 'Technician',
)

function formatAddress(address) {
  if (!address) return '—'
  const parts = [address.unitNo, address.street, address.district, address.state, address.postcode, address.country].filter(Boolean)
  return parts.join(', ') || '—'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
