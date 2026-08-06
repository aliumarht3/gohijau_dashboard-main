import { defineStore } from 'pinia'
import { getProfile } from '@/services/auth'

export const useUserStoreProfileCall = defineStore('user', {
  state: () => ({
    profile: null,
  }),
  actions: {
    async fetchProfile() {
      this.profile = await getProfile()
    },
    clearProfile() {
      this.profile = null
    },
  },
})
