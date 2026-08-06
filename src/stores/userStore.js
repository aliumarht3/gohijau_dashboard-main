import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProfile } from '@/services/auth'
export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const selectedRole = ref(null)

    const isLoggedIn = computed(() => !!user.value)

    function setUser(profile) {
        user.value = profile
    }

    async function fetchProfile() {
        try {
            const profile = await getProfile()
            // If the user had previously selected a role and it still exists, restore it
            if (selectedRole.value && profile.allRoles?.includes(selectedRole.value)) {
                profile.userRole = selectedRole.value
            } else {
                // Clear stale selection so it doesn't persist after role removal
                selectedRole.value = profile.userRole
            }
            user.value = profile
            return profile
        } catch (err) {
            console.error('Error fetching profile:', err)
            user.value = null
        }
    }

    function clearUser() {
        user.value = null
        selectedRole.value = null
    }

    function setActiveRole(role) {
        if (user.value && user.value.allRoles?.includes(role)) {
            user.value.userRole = role
            selectedRole.value = role
        }
    }

    return {
        user,
        isLoggedIn,
        setUser,
        clearUser,
        fetchProfile,
        setActiveRole
    }
}, { persist: true })
