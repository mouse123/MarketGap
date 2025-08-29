import { createRouter, createWebHistory } from 'vue-router'
import MarketDashboard from '@/views/MarketDashboard.vue'
import MarketModules from '@/views/MarketModules/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/markets'
    },
    {
      path: '/markets',
      name: 'markets',
      component: MarketDashboard,
    },
    {
      path: '/markets/:id',
      name: 'market-item',
      component: MarketModules,
    },
  ],
})

export default router
