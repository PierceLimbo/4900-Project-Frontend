import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import BrowseView from '../views/BrowseView.vue';
import GameDetailView from '../views/GameDetailView.vue';
import ReviewsView from '../views/ReviewsView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/browse',
      name: 'browse',
      component: BrowseView
    },
    {
      path: '/games/:game_id',
      name: 'game-details',
      component: GameDetailView
    },
    {
      path: '/reviews/:game_id',
      name: 'game-reviews',
      component: ReviewsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reviews',
      name: 'all-reviews',
      component: ReviewsView,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
