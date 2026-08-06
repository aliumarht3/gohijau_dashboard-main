import api from '@/lib/apiClient'

// ─── Organization Type Normalization ────────────────────────────────────────────
// The backend serializes OrganizationType enum values as strings (e.g. "OilCollector")
// due to JsonStringEnumConverter. We normalize them back to integers so the
// checkbox v-model bindings work correctly throughout the app.

const ORG_TYPE_MAP = {
  OilCollector: 1,
  MachineOwner: 2,
  GoHijauOwner: 3,
  Manufacturer: 4,
}

function normalizeOrg(org) {
  if (!org) return org
  return {
    ...org,
    organizationTypes: (org.organizationTypes || []).map((t) =>
      typeof t === 'number' ? t : (ORG_TYPE_MAP[t] ?? t),
    ),
  }
}

// ─── Organization CRUD ─────────────────────────────────────────────────────────

export async function fetchAllOrganizations() {
  const res = await api.get('/api/organization/all')
  return (res.data || []).map(normalizeOrg)
}

export async function fetchOrganizationById(id) {
  const res = await api.get(`/api/organization/${id}`)
  return normalizeOrg(res.data)
}

export async function createOrganization(formData, certificateFile) {
  const payload = new FormData()
  payload.append('OrganizationName', formData.organizationName)
  payload.append('UnitNo', formData.address?.unitNo || '')
  payload.append('Street', formData.address?.street || '')
  payload.append('District', formData.address?.district || '')
  payload.append('Postcode', formData.address?.postcode || '')
  payload.append('State', formData.address?.state || '')
  payload.append('Country', formData.address?.country || '')

  if (certificateFile) {
    payload.append('CompanyCertificate', certificateFile)
  }

  // OrganizationTypes - array of integers
  if (formData.organizationTypes && formData.organizationTypes.length) {
    formData.organizationTypes.forEach((type) => payload.append('OrganizationTypes', type))
  }

  if (formData.collectorRate != null) payload.append('CollectorRate', formData.collectorRate)
  if (formData.profitRate != null) payload.append('ProfitRate', formData.profitRate)
  if (formData.creditLimit != null) payload.append('Creditlimit', formData.creditLimit)
  if (formData.debt != null) payload.append('Debt', formData.debt)

  if (formData.invoiceEmails && formData.invoiceEmails.length) {
    formData.invoiceEmails.forEach((email) => payload.append('InvoiceEmails', email))
  }
  if (formData.notificationEmails && formData.notificationEmails.length) {
    formData.notificationEmails.forEach((email) => payload.append('NotificationEmails', email))
  }

  const res = await api.post('/api/organization/create', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function updateOrganization(id, formData, certificateFile) {
  const payload = new FormData()
  payload.append('OrganizationName', formData.organizationName)
  payload.append('UnitNo', formData.address?.unitNo || '')
  payload.append('Street', formData.address?.street || '')
  payload.append('District', formData.address?.district || '')
  payload.append('Postcode', formData.address?.postcode || '')
  payload.append('State', formData.address?.state || '')
  payload.append('Country', formData.address?.country || '')

  if (certificateFile) {
    payload.append('CompanyCertificate', certificateFile)
  }

  // OrganizationTypes - array of integers
  if (formData.organizationTypes && formData.organizationTypes.length) {
    formData.organizationTypes.forEach((type) => payload.append('OrganizationTypes', type))
  }

  if (formData.collectorRate != null) payload.append('CollectorRate', formData.collectorRate)
  if (formData.profitRate != null) payload.append('ProfitRate', formData.profitRate)
  if (formData.customerRate != null) payload.append('CustomerRate', formData.customerRate)
  if (formData.creditLimit != null) payload.append('Creditlimit', formData.creditLimit)

  if (formData.invoiceEmails && formData.invoiceEmails.length) {
    formData.invoiceEmails.forEach((email) => payload.append('InvoiceEmails', email))
  }
  if (formData.notificationEmails && formData.notificationEmails.length) {
    formData.notificationEmails.forEach((email) => payload.append('NotificationEmails', email))
  }

  const res = await api.patch(`/api/organization/update/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function addOrganizationDebt(id, debt) {
  const payload = new FormData()
  payload.append('debt', debt)
  payload.append('organizationId', id)

  const res = await api.post('/api/organization/add-debt', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function deleteOrganization(id) {
  const res = await api.delete(`/api/organization/delete/${id}`)
  return res.data
}

export async function addOrganizationEmails(organizationId, invoiceEmails, notificationEmails) {
  const res = await api.post('/api/organization/add-email', {
    organizationId,
    invoiceEmails: invoiceEmails.filter((e) => e.trim() !== ''),
    notificationEmails: notificationEmails.filter((e) => e.trim() !== ''),
  })
  return res.data
}

// ─── Employee (Users under an Org) ──────────────────────────────────────────────

export async function fetchEmployeesByOrganization(organizationId) {
  const res = await api.get(`/api/user/by-organization/${organizationId}`)
  return res.data
}

export async function createEmployee(payload) {
  // Uses existing user create endpoint
  const res = await api.post('/api/user/create', payload)
  return res.data
}

export async function updateEmployee(payload) {
  const res = await api.patch('/api/user/profile', payload)
  return res.data
}

export async function deleteEmployee(email) {
  const res = await api.delete('/api/user/delete-account', {
    data: { targetUserEmail: email },
    headers: { 'Content-Type': 'application/json' },
  })
  return res.data
}
