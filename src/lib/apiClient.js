import axios from 'axios'
import router from '@/router'
import { useToast } from 'vue-toastification'

export const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://services.gohijau.org'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let refreshSubscribers = []
let sessionToastShown = false

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

export function showToast(message, error = false) {
  const toast = useToast()

  if (!sessionToastShown) {
    const options = {
      onClose: () => {
        // Reset when toast disappears (timeout or user closes it)
        resetSessionToast()
      },
    }

    if (error) {
      toast.error(message, options)
    }
    else {
      toast.warning(message, options)
    }
    sessionToastShown = true
  }
}

export function resetSessionToast() {
  sessionToastShown = false
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- Handle expired / unauthorized responses globally ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (!response) {
      showToast('Network error. Please try again.', true)
      return Promise.reject(error)
    }

    // 🟠 Handle forbidden (role unauthorized)
    if (response.status === 403) {
      console.warn('403 Forbidden – user not authorized')
      showToast('You do not have permission to access this page.', false)
      router.push({ name: 'Dashboard' }) // or AccessDenied page if you have one
      return Promise.reject(error)
    }

    // 🟡 Handle expired/invalid token (401)
    if (response.status === 401 && !config._retry) {
      config._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        // No refresh token — log out and go to login
        showToast('Session expired. Please log in again.', true)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        router.push({ name: 'login' })
        return Promise.reject(error)
      }

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`
            resolve(api(config))
          })
        })
      }

      isRefreshing = true
      try {
        // 🔁 Call refresh token endpoint
        const refreshResponse = await axios.post(`${baseURL}/api/auth/refreshToken`, {
          refreshToken,
        })

        const newAccessToken = refreshResponse.data.accessToken
        const newRefreshToken = refreshResponse.data.refreshToken

        localStorage.setItem('access_token', newAccessToken)
        localStorage.setItem('refresh_token', newRefreshToken)

        // Update all queued requests
        onRefreshed(newAccessToken)
        isRefreshing = false

        // Retry original request
        config.headers.Authorization = `Bearer ${newAccessToken}`
        return api(config)
      } catch (refreshError) {
        showToast('Session expired. Please log in again.', true)
        console.error('Token refresh failed:', refreshError)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        isRefreshing = false
        router.push({ name: 'login' })
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
