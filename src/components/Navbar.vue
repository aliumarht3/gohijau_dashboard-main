<template>
  <header class="h-16 bg-gradient-to-b from-green-700 to-green-500 shadow-md px-7 flex items-center justify-between">
    <!-- App Title -->
    <h1 class="text-xl font-semibold text-white">GoHijau Admin Dashboard</h1>

    <!-- User Menu -->
    <div class="relative">
      <button
        @click="toggleMenu"
        class="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
          alt="User avatar"
          class="w-8 h-8 rounded-full"
        />
        <span class="text-sm font-medium text-white hidden md:inline">{{ userStore.user?.name }}</span>
        <svg
          class="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Dropdown -->
      <transition name="fade">
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >
          <!-- Profile link -->
          <a
            @click.prevent="router.push('/profile')"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Profile
          </a>

          <!-- Role Switcher — only shown when user has more than one role -->
          <div v-if="hasMultipleRoles" class="border-t border-gray-100">
            <button
              @click.stop="toggleRoleAccordion"
              class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Switch Role
              </span>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="showRoleAccordion ? 'rotate-180' : ''"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Role list -->
            <transition name="accordion">
              <div v-if="showRoleAccordion" class="bg-gray-50 border-t border-gray-100">
                <button
                  v-for="role in userStore.user.allRoles"
                  :key="role"
                  @click.stop="selectRole(role)"
                  class="w-full flex items-center justify-between px-5 py-2 text-sm hover:bg-green-50 transition-colors"
                  :class="role === userStore.user.userRole ? 'text-green-700 font-semibold' : 'text-gray-600'"
                >
                  {{ role }}
                  <svg
                    v-if="role === userStore.user.userRole"
                    class="w-4 h-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
              </div>
            </transition>
          </div>

          <!-- Logout -->
          <div class="border-t border-gray-100">
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
userStore.fetchProfile()

const showMenu = ref(false)
const showRoleAccordion = ref(false)

const hasMultipleRoles = computed(() =>
  (userStore.user?.allRoles?.length ?? 0) > 1
)

function toggleMenu() {
  showMenu.value = !showMenu.value
  if (!showMenu.value) showRoleAccordion.value = false
}

function toggleRoleAccordion() {
  showRoleAccordion.value = !showRoleAccordion.value
}

function selectRole(role) {
  userStore.setActiveRole(role)
  showRoleAccordion.value = false
  showMenu.value = false

  if (router.currentRoute.value.path !== "/") {
    router.push("/")
  }
}

function logout() {
  localStorage.removeItem('access_token')
  userStore.clearUser()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showMenu.value = false
      showRoleAccordion.value = false
    }
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.accordion-enter-active, .accordion-leave-active {
  transition: max-height 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
  max-height: 200px;
}
.accordion-enter-from, .accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
