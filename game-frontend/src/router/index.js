import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BrowseView from '@/views/BrowseView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/browse', name: 'browse', component: BrowseView},
  { path: '/reviews', name: 'reviews', component: () => import('../views/ReviewsView.vue') },
  { path: '/games/:id', name: 'game-detail', component: () => import('../views/GameDetailView.vue'), props: true },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
