import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import Dashboard from '@/views/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, title: 'Dashboard - GoHijau' },
    },
    {
      path: '/organizationManagement',
      name: 'organizationManagement',
      component: () => import('../views/OrganizationManagementView.vue'),
      meta: { title: 'Organizations - GoHijau', requiresAuth: true }
    },
    {
      path: '/userManagement',
      name: 'userManagement',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UserManagementView.vue'),
      meta: { title: 'Users - GoHijau' }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/machineManagement',
      name: 'machineManagement',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MachineManagementView.vue'),
      meta: { title: 'Machines - GoHijau' }
    },
    {
      path: '/machineManufacturer',
      name: 'machineManufacturer',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ManufacturerMachines.vue'),
      meta: { title: 'Manufacturer - GoHijau' }
    },
    {
      path: '/machineCollector',
      name: 'machineCollector',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MachineCollector.vue'),
      meta: { title: 'Collector - GoHijau' }
    },
    {
      path: '/telemetry',
      name: 'machineTelemetry',
      component: () => import('../views/MachineTelemetryView.vue'),
      meta: { title: 'Machine Telemetry - GoHijau', requiresAuth: true }
    },
    {
      path: '/diagnostics',
      name: 'machineDiagnostics',
      component: () => import('../views/DiagnosticsView.vue'),
      meta: { title: 'Machine Diagnostics 2.0 - GoHijau', requiresAuth: true }
    },
    {
      path: '/diagnostics-old',
      name: 'machineDiagnosticsOld',
      component: () => import('../views/DiagnosticsOldView.vue'),
      meta: { title: 'Machine Diagnostics 1.0 - GoHijau', requiresAuth: true }
    },
    {
      path: '/collectorHistory',
      name: 'collectorHistory',
      component: () => import('../views/CollectorHistoryView.vue'),
      meta: { title: 'Collector History - GoHijau', requiresAuth: true }
    },
    {
      path: '/ownerPayout',
      name: 'ownerPayout',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/OwnerPayout.vue'),
      meta: { title: 'Payout Owner - GoHijau' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Login - GoHijau' }
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { title: 'Forgot Password - GoHijau' }
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: { title: 'Reset Password - GoHijau' }
    },
    {
      path: '/physical-history',
      name: 'physicalHistory',
      component: () => import('../views/PhysicalHistoryView.vue'),
      meta: { title: 'Physical Checks - GoHijau', requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    // Prevent logged-in users from visiting login again
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'GoHijau'
})

export default router
