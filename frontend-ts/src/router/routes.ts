import { RouteConfig } from 'vue-router'
import store from '../store/auth'

const authGuard = (to, from, next: ({ path }?: {path: string}) => void) => {
  if (store.getters.getCurrentUser(store.state) === null) next({ path: '/auth' })
  else next()
}
const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
    beforeEnter: authGuard

  }, {
    path: '/auth',
    name: 'Auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{
      path: '', component: () => import('pages/Auth.vue')
    }]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
