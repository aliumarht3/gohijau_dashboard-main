import api from '@/lib/apiClient'
import { useUserStore } from '@/stores/userStore'

export async function fetchOilData() {
    const userStore = useUserStore()
    const role = userStore.user?.userRole
    if (!role) {
      console.warn("User not loaded yet")
      return
    }
    const token = localStorage.getItem('access_token')

    let apiUrl = ''
    switch (role) {
        case 'Admin':
        case 'GoHijauOwner':
            apiUrl = '/api/admin/total-oil'
            break
        case 'Owner':
            apiUrl = '/api/owner/total-oil'
            break
        default:
            throw new Error('Unauthorized: role not permitted to view oil data')
    }

    const response = await api.get(apiUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data // in litres or tonnes depending on your API
}
