<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-semibold text-gray-800">
          {{ modalTitle }}
        </h2>
        <button @click="$emit('close')" :disabled="saving" class="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Organization Name -->
        <div>
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Organization Name <span class="text-red-500">*</span>
            <InfoTooltip text="The official registered name of the organization." />
          </label>
          <input
            v-model="formData.organizationName"
            type="text"
            required
            :disabled="isViewMode"
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Organization Types -->
        <div>
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Organization Types <span class="text-red-500">*</span>
            <InfoTooltip text="Select all roles that apply to this organization. At least one type must be chosen." />
          </label>
          <div class="mt-2 space-y-2">
            <label class="flex items-center">
              <input
                v-model="formData.organizationTypes"
                type="checkbox"
                :value="1"
                :disabled="isViewMode"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <span class="ml-2 text-sm text-gray-700">Oil Collector</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.organizationTypes"
                type="checkbox"
                :value="2"
                :disabled="isViewMode"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <span class="ml-2 text-sm text-gray-700">Machine Owner</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.organizationTypes"
                type="checkbox"
                :value="3"
                :disabled="isViewMode"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <span class="ml-2 text-sm text-gray-700">GoHijau Owner</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.organizationTypes"
                type="checkbox"
                :value="4"
                :disabled="isViewMode"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <span class="ml-2 text-sm text-gray-700">Manufacturer</span>
            </label>
          </div>
        </div>

        <!-- Address Section -->
        <fieldset class="border border-gray-200 rounded-lg p-4 space-y-3">
          <legend class="flex items-center gap-1.5 text-sm font-semibold text-gray-600 px-2">
            Address <span class="text-red-500">*</span>
            <InfoTooltip text="Full registered address of the organization." />
          </legend>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="flex items-center gap-1 text-xs font-medium text-gray-600">
                Unit No <span class="text-red-500">*</span>
                <InfoTooltip text="Unit, suite, or lot number (e.g. A-12-3 or No. 5)." />
              </label>
              <input
                v-model="formData.address.unitNo"
                type="text"
                required
                :disabled="isViewMode"
                class="w-full border rounded px-3 py-1.5 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="flex items-center gap-1 text-xs font-medium text-gray-600">
                Street <span class="text-red-500">*</span>
                <InfoTooltip text="Street name and number (e.g. Jalan Ampang 42/1C)." />
              </label>
              <input
                v-model="formData.address.street"
                type="text"
                required
                :disabled="isViewMode"
                class="w-full border rounded px-3 py-1.5 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="flex items-center gap-1 text-xs font-medium text-gray-600">
                District <span class="text-red-500">*</span>
                <InfoTooltip text="Area or sub-district within the city (e.g. Chow Kit, Bangsar)." />
              </label>
              <input
                v-model="formData.address.district"
                type="text"
                required
                :disabled="isViewMode"
                class="w-full border rounded px-3 py-1.5 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="flex items-center gap-1 text-xs font-medium text-gray-600">
                State <span class="text-red-500">*</span>
                <InfoTooltip text="State or federal territory the organization is located in." />
              </label>
              <input
                v-model="formData.address.state"
                type="text"
                required
                :disabled="isViewMode"
                class="w-full border rounded px-3 py-1.5 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="flex items-center gap-1 text-xs font-medium text-gray-600">
                Postcode <span class="text-red-500">*</span>
                <InfoTooltip text="5-digit postal code of the organization's address." />
              </label>
              <input
                v-model="formData.address.postcode"
                type="text"
                required
                :disabled="isViewMode"
                class="w-full border rounded px-3 py-1.5 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label class="flex items-center gap-1 text-xs font-medium text-gray-600">
                Country <span class="text-red-500">*</span>
                <InfoTooltip text="Country where the organization is registered and operates." />
              </label>
              <input
                v-model="formData.address.country"
                type="text"
                required
                :disabled="isViewMode"
                class="w-full border rounded px-3 py-1.5 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </fieldset>

        <!-- Certificate Upload -->
        <div>
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Certificate Document <span v-if="isCreateMode" class="text-red-500">*</span>
            <InfoTooltip text="Upload the organization's official registration or certification document (PDF, image, or Word file)." />
          </label>
          <div v-if="formData.certificatePath && isViewMode" class="mt-1">
            <a
              :href="`${baseURL}${formData.certificatePath}`"
              target="_blank"
              class="text-sm text-green-600 underline hover:text-green-700"
            >
              View Current Certificate
            </a>
          </div>
          <div v-if="!isViewMode" class="mt-1">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              :required="isCreateMode"
              @change="handleFileUpload"
              class="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p v-if="formData.certificatePath" class="text-xs text-gray-500 mt-1">
              Current: {{ formData.certificatePath }}
            </p>
          </div>
        </div>

        <!-- Collector Rate — visible to Admin/GoHijauOwner and Collector orgs (but read-only for collectors) -->
        <div v-if="showCollectorRate">
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Collector Rate <span class="text-red-500">*</span>
            <InfoTooltip text="Rate (RM per KG) paid to the oil collector for each collection." />
          </label>
          <input
            v-model.number="formData.collectorRate"
            type="number"
            step="0.01"
            required
            :disabled="isViewMode || !canEditRates"
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Profit Rate — visible to Admin/GoHijauOwner and Owner orgs (but read-only for owners) -->
        <div v-if="showProfitRate">
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Profit Rate <span class="text-red-500">*</span>
            <InfoTooltip text="Rate (RM per KG) paid to the machine owner for every Kg of oil collected." />
          </label>
          <input
            v-model.number="formData.profitRate"
            type="number"
            step="0.01"
            required
            :disabled="isViewMode || !canEditRates"
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Customer Rate — visible to Admin/GoHijauOwner only -->
        <div v-if="showCustomerRate">
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Customer Rate <span class="text-red-500">*</span>
            <InfoTooltip text="Points or reward rate awarded to customers per litre of oil deposited." />
          </label>
          <input
            v-model.number="formData.customerRate"
            type="number"
            step="0.01"
            required
            :disabled="isViewMode || !canEditRates"
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Credit Limit — visible to Admin/GoHijauOwner and Collector orgs (but read-only for collectors) -->
        <div v-if="showCreditLimit">
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Credit Limit (RM) <span class="text-red-500">*</span>
            <InfoTooltip text="Maximum outstanding credit (RM) the organization is allowed to carry before collections are paused." />
          </label>
          <input
            v-model.number="formData.creditLimit"
            type="number"
            step="0.01"
            required
            :disabled="isViewMode || !canEditRates"
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Debt (only for create) -->
        <div v-if="isCreateMode">
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Debt (RM) <span class="text-red-500">*</span>
            <InfoTooltip text="Initial outstanding debt amount (RM) carried over when onboarding this organization." />
          </label>
          <input
            v-model.number="formData.debt"
            type="number"
            min="0"
            step="0.01"
            required
            :disabled="isViewMode"
            class="w-full border rounded px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Invoice Emails -->
        <div>
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Invoice Emails
            <InfoTooltip text="Optional. Email addresses that will receive generated invoices. Add multiple addresses as needed." />
          </label>
          <div class="space-y-2 mt-1">
            <div v-for="(email, idx) in formData.invoiceEmails" :key="'inv-' + idx" class="flex items-center gap-2">
              <input
                v-model="formData.invoiceEmails[idx]"
                type="email"
                :disabled="isViewMode"
                class="flex-1 border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="email@example.com"
              />
              <button
                v-if="!isViewMode && formData.invoiceEmails.length > 1"
                type="button"
                @click="formData.invoiceEmails.splice(idx, 1)"
                class="text-red-500 hover:text-red-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <button
              v-if="!isViewMode"
              type="button"
              @click="formData.invoiceEmails.push('')"
              class="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              + Add Email
            </button>
          </div>
        </div>

        <!-- Notification Emails -->
        <div>
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            Notification Emails
            <InfoTooltip text="Optional. Email addresses that will receive system alerts and operational notifications." />
          </label>
          <div class="space-y-2 mt-1">
            <div v-for="(email, idx) in formData.notificationEmails" :key="'notif-' + idx" class="flex items-center gap-2">
              <input
                v-model="formData.notificationEmails[idx]"
                type="email"
                :disabled="isViewMode"
                class="flex-1 border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="email@example.com"
              />
              <button
                v-if="!isViewMode && formData.notificationEmails.length > 1"
                type="button"
                @click="formData.notificationEmails.splice(idx, 1)"
                class="text-red-500 hover:text-red-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <button
              v-if="!isViewMode"
              type="button"
              @click="formData.notificationEmails.push('')"
              class="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              + Add Email
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            :disabled="saving"
            @click="$emit('close')"
            class="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </button>
          <button
            v-if="!isViewMode"
            type="submit"
            :disabled="saving"
            class="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              v-if="saving"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ saving ? (organization ? 'Updating...' : 'Creating...') : (organization ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { baseURL } from '@/lib/apiClient'
import InfoTooltip from '@/components/InfoTooltip.vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  organization: { type: Object, default: null },
  mode: { type: String, default: 'create' }, // 'create' | 'edit' | 'view'
  userRole: { type: String, default: '' },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])

const certificateFile = ref(null)

const defaultFormData = () => ({
  organizationName: '',
  organizationTypes: [],
  address: {
    unitNo: '',
    street: '',
    district: '',
    state: '',
    postcode: '',
    country: '',
  },
  certificatePath: '',
  collectorRate: null,
  profitRate: null,
  customerRate: null,
  creditLimit: null,
  debt: 0,
  invoiceEmails: [''],
  notificationEmails: [''],
})

const formData = ref(defaultFormData())

const isViewMode = computed(() => props.mode === 'view')
const isCreateMode = computed(() => props.mode === 'create')
const isAdmin = computed(() => ['Admin', 'GoHijauOwner'].includes(props.userRole))
const canEditRates = computed(() => isAdmin.value)
const showCollectorRate = computed(() => {
  if (isAdmin.value) return true
  if (props.userRole === 'OilCollector') return true
  return false
})

const showProfitRate = computed(() => {
  if (isAdmin.value) return true
  if (props.userRole === 'Owner') return true
  return false
})

const showCustomerRate = computed(() => {
  return isAdmin.value
})

const showCreditLimit = computed(() => {
  if (isAdmin.value) return true
  if (props.userRole === 'OilCollector') return true
  return false
})

const modalTitle = computed(() => {
  if (props.mode === 'view') return 'View Organization'
  if (props.organization) return 'Edit Organization'
  return 'Create Organization'
})

watch(
  () => [props.organization, props.show],
  ([newOrg, showing]) => {
    if (!showing) return
    certificateFile.value = null
    if (newOrg) {
      formData.value = {
        id: newOrg.id,
        organizationName: newOrg.organizationName || '',
        organizationTypes: newOrg.organizationTypes?.length ? [...newOrg.organizationTypes] : [],
        address: {
          unitNo: newOrg.address?.unitNo || '',
          street: newOrg.address?.street || '',
          district: newOrg.address?.district || '',
          state: newOrg.address?.state || '',
          postcode: newOrg.address?.postcode || '',
          country: newOrg.address?.country || '',
        },
        certificatePath: newOrg.certificatePath || '',
        collectorRate: newOrg.collectorRate ?? null,
        profitRate: newOrg.profitRate ?? null,
        customerRate: newOrg.customerRate ?? null,
        creditLimit: newOrg.creditLimit ?? null,
        debt: Number(newOrg.debt ?? 0),
        invoiceEmails: newOrg.invoiceEmails?.length ? [...newOrg.invoiceEmails] : [''],
        notificationEmails: newOrg.notificationEmails?.length ? [...newOrg.notificationEmails] : [''],
      }
    } else {
      formData.value = defaultFormData()
    }
  },
  { immediate: true, deep: true },
)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    certificateFile.value = file
  }
}

function handleSubmit() {
  const mode = props.organization ? 'edit' : 'create'

  if (formData.value.organizationTypes.length === 0) {
    alert('Please select at least one Organization Type.')
    return
  }

  if (mode === 'create') {
    const debt = Number(formData.value.debt ?? 0)
    if (debt < 0) {
      alert('Debt cannot be negative.')
      return
    }
    emit('save', {
      mode,
      formData: {
        ...formData.value,
      },
      certificateFile: certificateFile.value,
    })
    return
  }

  emit('save', {
    mode,
    formData: { ...formData.value },
    certificateFile: certificateFile.value,
  })
}
</script>
