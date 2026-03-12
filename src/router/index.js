import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SunSafetyDashboard from '../views/SunSafetyDashboard.vue'
import isAuthenticated from '@/authenticate'
const routes = [
  {
    path: '/',
    redirect: '/SunSafety',
  },
  {
    path: '/Home',
    component: HomeView,
    alias: ['/home'],
  },
  {
    path: '/SunSafety',
    component: SunSafetyDashboard,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.requiresRole
  const currentRole = localStorage.getItem('userRole')

  if (requiresAuth && !isAuthenticated.value) {
    next('/AccessDenied')
    return
  }

  if (requiredRole && currentRole !== requiredRole) {
    next('/AccessDenied')
    return
  }

  next()
})

export default router
