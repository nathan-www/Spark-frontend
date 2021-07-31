import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/account/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/account/token/:token',
    name: 'Token',
    component: () => import('../views/Token.vue')
  },
  {
    path: '/meetings',
    name: 'Meetings',
    component: () => import('../views/Meetings.vue')
  },
  {
    path: '/meeting/:meeting_id',
    name: "Meeting",
    component: () => import('../views/Meeting.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
