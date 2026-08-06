<template>
  <DashboardLayout>
    <Card class="mt-4">
      <h2 class="text-xl font-semibold mb-4">User Management</h2>
      <UserTable
        :users="users"
        :loadingId="loadingId"
        @create="openCreateModal"
        @edit="openEditModal"
        @delete="deleteUser"
        @view="openViewModal"
      />
    </Card>

    <!-- Modal -->
    <UserFormModal
      :show="showModal"
      :organizations="organizations"
      :roles="roles"
      :user="selectedUser"
      :isSaving="isSaving"
      :saveError="saveError"
      @close="closeModal"
      @save="saveUser"
    />

    <UserDetailsModal
      :show="showDetailsModal"
      :user="viewedUser"
      @close="showDetailsModal = false"
    />
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/dashboard_template.vue'
import Card from '@/components/Card.vue'
import UserTable from '@/components/UserTable.vue'
import UserFormModal from '@/components/UserFormModal.vue'
import UserDetailsModal from '@/components/UserDetailsModal.vue'
import { ref, onMounted } from 'vue'
import api from '@/lib/apiClient'

const users = ref([])
const loadingId = ref(null)
const showModal = ref(false)
const showDetailsModal = ref(false)
const viewedUser = ref(null)
const selectedUser = ref(null)
const organizations = ref([])
const roles = ref([])
const isSaving = ref(false)
const saveError = ref(null)

onMounted(async () => {
  try {
    const organizationsRes = await api.get('/api/organization/all')
    organizations.value = organizationsRes.data
    const rolesRes = await api.get('/api/roles/all')
    roles.value = rolesRes.data
    await fetchUsers()
  } catch (err) {
    console.error('Failed to fetch organizations:', err)
  }
})

async function fetchUsers() {
  try {
    const res = await api.get('/api/user/all')
    users.value = res.data
  } catch (err) {
    console.error('❌ Failed to fetch users:', err)
  }
}

function openCreateModal() {
  selectedUser.value = null // blank form
  showModal.value = true
}

function openEditModal(user) {
  selectedUser.value = {
    ...user,
    organizationId: user.organizationId || '',
    roles: user.roles || [''],
  }
  showModal.value = true
}

function openViewModal(user) {
  viewedUser.value = user
  showDetailsModal.value = true
}

function closeModal() {
  showModal.value = false
  saveError.value = null
}

async function saveUser({ mode, formData }) {
  isSaving.value = true
  saveError.value = null

  try {
    if (mode === 'edit') {
      await api.patch('/api/user/profile', {
        userId: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nricOrPassport: formData.nricOrPassport,
        organizationId: formData.organizationId,
        roleId: formData.rolesId,
      })
    } else {
      await api.post('/api/user/create', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nricOrPassport: formData.nricOrPassport,
        organizationId: formData.organizationId,
        roleId: formData.rolesId,
      })
    }

    await fetchUsers()
    closeModal()
  } catch (error) {
    saveError.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong. Please try again.'
  } finally {
    isSaving.value = false
  }
}

async function deleteUser(user) {
  if (!confirm(`Delete ${user.name}?`)) return

  loadingId.value = user.id // show loader for this specific user

  try {
    const response = await api.delete('/api/user/delete-account', {
      data: { targetUserEmail: user.email },
      headers: { 'Content-Type': 'application/json' },
    })
    await fetchUsers()
  } catch (error) {
    console.error('❌ Failed to delete user:', error.response?.data || error.message)
    alert(error.response?.data?.message || 'Failed to delete user')
  } finally {
    loadingId.value = null // reset loader
  }
}
</script>
