import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import beforeEach from '../helpers/beforeEach'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/watch-list',
    name: 'WatchList',
    component: () => import('../views/WatchList')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/AuthLogin.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    props: { fromLogout: false },
    component: () => import('../views/auth/AuthLogout.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(beforeEach)

export default router
