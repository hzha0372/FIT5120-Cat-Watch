import { createRouter, createWebHistory } from 'vue-router'
import CatWatchMapView from '../views/CatWatchMapView.vue'
import HomeDashboardView from '../views/HomeDashboardView.vue'
import VisionMissionView from '../views/VisionMissionView.vue'

const routes = [
  {
    path: '/',
    component: HomeDashboardView,
  },
  {
    path: '/risk-map',
    component: CatWatchMapView,
  },
  {
    path: '/vision-mission',
    component: VisionMissionView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
