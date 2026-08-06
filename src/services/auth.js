import api, { resetSessionToast } from '@/lib/apiClient'

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password })
  console.log('res: ', res)

  const token = res.data.accessToken
  const refreshToken = res.data.refreshToken

  localStorage.setItem('access_token', token)
  localStorage.setItem('refresh_token', refreshToken)

  resetSessionToast()
}

export async function requestPasswordReset(email) {
  const source = 'web';
  const res = await api.post('/api/auth/forgot-password', { email, source })
  return res.data
}

export async function resetPassword(token, newPassword) {
  const res = await api.post('/api/auth/reset-password', { token, newPassword })
  return res.data
}

export async function validateResetToken(token) {
  const res = await api.get('/api/auth/validate-reset-token', { params: { token } })
  return res.data
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  resetSessionToast()
}

export async function getProfile() {
  const res = await api.get('/api/user/profile')
  return res.data
}

export function isLoggedIn() {
  return !!localStorage.getItem('access_token')
}
