import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/FilmsListView.vue'),
    },
    {
      path: '/films/:id',
      name: 'film-detail',
      component: () => import('@/views/FilmDetailView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminFilmsView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/films/new',
      name: 'admin-film-create',
      component: () => import('@/views/admin/FilmFormView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/films/:id/edit',
      name: 'admin-film-edit',
      component: () => import('@/views/admin/FilmFormView.vue'),
      meta: { requiresAdmin: true },
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Redirect to home if authenticated user tries to access guest-only pages
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }

  // Redirect to login if unauthenticated user tries to access protected pages
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Redirect to home if non-admin tries to access admin pages
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
    return
  }

  next()
})

export default router
