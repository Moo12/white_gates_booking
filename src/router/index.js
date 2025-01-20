import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/auth/Login.vue'
import Signup from '@/views/auth/Signup.vue'
import Book from '@/views/hotel/Book.vue'
import Bookings from '@/views/hotel/Bookings.vue'
import Rooms from '@/views/hotel/Rooms.vue'
import AdminLayout from '@/views/AdminLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/book',
    name: 'Book',
    component: Book
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: Bookings
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: Rooms
  },
  {
    path: "/admin",
    name: 'AdminLayout',
    component: AdminLayout,
    children: [
      { path: "manage-availability", component: () => import("@/views/admin/ManageAvailability.vue") },
      { path: "manage-booking", component: () => import("@/views/admin/ManageBookings.vue") },
      { path: "manage-rooms", component: () => import("@/views/admin/ManageRooms.vue") },
      { path: "manage-pricing", component: () => import("@/views/admin/UpdatePricing.vue") },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
