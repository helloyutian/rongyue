import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/spare',
    name: 'Spare',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "spareList" */ '../views/spareList.vue')
  },
  {
    path: '/disabled',
    name: 'Disabled',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "disabledList" */ '../views/disabledList.vue')
  },
  {
    path: '/plane',
    name: 'Plane',
    component: () => import(/* webpackChunkName: "plane" */ '../views/plane.vue')
  },
  {
    path: '/price',
    name: 'Price',
    component: () => import(/* webpackChunkName: "plane" */ '../views/price.vue')
  },
  {
    path: '/error/:code',
    name: 'error',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "error" */ '../views/error.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
