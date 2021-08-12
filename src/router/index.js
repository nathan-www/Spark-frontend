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
  },
  {
    path: '/:join_link(\[a-f0-9-]{10,}\)',
    name: "JoinByLink",
    component: () => import('../views/JoinByLink.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: "404",
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
