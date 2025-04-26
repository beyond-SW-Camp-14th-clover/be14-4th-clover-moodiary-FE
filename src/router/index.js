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
            { path: 'shareddiary', name: 'SharedDiaryRoom', component: () => import('../modules/shareddiary/views/SharedDiaryMain.vue') },
            { path: '/shared-diary/:roomId', name: 'SharedDiaryList', component: () => import('../modules/shareddiary/views/SharedDiaryList.vue') },
            { path: '/shared-diary/:roomId/write', name: 'SharedDiaryWrite', component: () => import('../modules/shareddiary/views/SharedDiaryWrite.vue') },
            { path: '/shared-diary/:roomId/diary/:diaryId', name: 'SharedDiaryDetail', component: () => import('../modules/shareddiary/views/SharedDiaryDetail.vue') }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router