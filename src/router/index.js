import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Home from '../pages/Home.vue'
import Write from '../pages/Write.vue'

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', name: 'Home', component: Home },
            { path: 'write', name: 'Write', component: Write }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router