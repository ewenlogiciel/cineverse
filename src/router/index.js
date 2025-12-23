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
    // Actors
    {
      path: '/admin/actors',
      name: 'admin-actors',
      component: () => import('@/views/admin/AdminActorsView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/actors/new',
      name: 'admin-actor-create',
      component: () => import('@/views/admin/ActorFormView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/actors/:id/edit',
      name: 'admin-actor-edit',
      component: () => import('@/views/admin/ActorFormView.vue'),
      meta: { requiresAdmin: true },
    },
    // Categories
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: () => import('@/views/admin/AdminCategoriesView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/categories/new',
      name: 'admin-category-create',
      component: () => import('@/views/admin/CategoryFormView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/categories/:id/edit',
      name: 'admin-category-edit',
      component: () => import('@/views/admin/CategoryFormView.vue'),
      meta: { requiresAdmin: true },
    },
    // Comments
    {
      path: '/admin/comments',
      name: 'admin-comments',
      component: () => import('@/views/admin/AdminCommentsView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/comments/new',
      name: 'admin-comment-create',
      component: () => import('@/views/admin/CommentFormView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/comments/:id/edit',
      name: 'admin-comment-edit',
      component: () => import('@/views/admin/CommentFormView.vue'),
      meta: { requiresAdmin: true },
    },
    // Directors
    {
      path: '/admin/directors',
      name: 'admin-directors',
      component: () => import('@/views/admin/AdminDirectorsView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/directors/new',
      name: 'admin-director-create',
      component: () => import('@/views/admin/DirectorFormView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/directors/:id/edit',
      name: 'admin-director-edit',
      component: () => import('@/views/admin/DirectorFormView.vue'),
      meta: { requiresAdmin: true },
    },
    // Users
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('@/views/admin/AdminUsersView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/users/new',
      name: 'admin-user-create',
      component: () => import('@/views/admin/UserFormView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/users/:id/edit',
      name: 'admin-user-edit',
      component: () => import('@/views/admin/UserFormView.vue'),
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
