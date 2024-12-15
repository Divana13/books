import AdminLayout from "@/components/AdminLayout.vue";
import Navbar from "@/components/Navbar.vue";
import { useAuthStore } from "@/stores/AuthStore";
import AdminBookView from "@/views/AdminBookView.vue";
import AdminView from "@/views/AdminView.vue";
import BookView from "@/views/BookView.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import PdfShow from "@/views/PdfShow.vue";

import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: '/admin',
        redirect: '/login',
        meta: {isGuest:true},
        children: [
            {path: '/login', name: 'LoginView', component:AdminView},
        ]
    },
    {
        path: '/',
        redirect: '/books',
        component:Navbar,
        children: [
            {path: '/books', name: 'BookView', component:BookView},
            {path: '/books/:id', name: 'BookDetail', component:PdfShow, props:true},
        ]
    },
    {
        path: '/admin',
        redirect: '/admin_books',
        component: AdminLayout,
        meta: {requiredAuth:true},
        children: [
            {path: '/admin_books', name: 'AdminBookView', component: AdminBookView}
        ]
    },
    {path:'/:catchall(.*)', name:'not-found', component: PageNotFound}
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if(to.meta.requiredAuth && !authStore.token) {
        next({name: 'LoginView'});
    } else if (authStore.token && to.meta.isGuest) {
        next({name: 'AdminBookView'})
    } else {
        next();
    }
})

export default router;