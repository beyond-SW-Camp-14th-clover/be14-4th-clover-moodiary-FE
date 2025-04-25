import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Home from '../pages/Home.vue'
import MyDiary from '../modules/notebook/views/NotebookLayout.vue'
import MyPage from '../pages/MyPage.vue'
import LoginPage from '../pages/LoginPage.vue'

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', name: 'Home', component: Home },
            {
                path: 'mydiary',
                component: MyDiary,
                children: [
                    { path: '' , redirect: 'mydiarymine' },
                    { path: 'mydiarymine', name: 'MyDiary', component: () => import('../modules/notebook/views/MyDiaryMine.vue') },
                    { path: 'emotion', name: 'MyEmotion', component: () => import('../modules/emotion/views/MyEmotionMain.vue') },
                    // { path: 'free', name: 'FreeNote', component: () => import('../modules/notebook/views/tabs/FreeNote.vue') }
                ]
            },
            { path: 'mypage', name: 'MyPage', component: MyPage },
            { path: 'login', name: 'Login', component: LoginPage },
            { path: 'shareddiary', name: 'SharedDiaryRoom', component: () => import('../modules/shareddiary/views/SharedDiaryMain.vue') }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router