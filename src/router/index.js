import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Home from '../pages/Home.vue'
import MyDiary from '../pages/mydiary/views/NotebookLayout.vue'
import MyPage from '../pages/users/views/MyPage.vue'
import LoginPage from '../pages/users/views/Login.vue'
import SignUp from '../pages/users/views/SignUp.vue'

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
                    { path: '', redirect: 'mydiarymine' },
                    { path: 'mydiarymine', name: 'MyDiary', component: () => import('../pages/mydiary/views/MyDiaryMine.vue') },
                    { path: 'emotion', name: 'MyEmotion', component: () => import('../pages/emotion/views/MyEmotionMain.vue') }
                ]
            },
            { path: 'mypage', name: 'MyPage', component: MyPage },
            { path: 'shareddiary', name: 'SharedDiaryRoom', component: () => import('../pages/shareddiary/views/SharedDiaryMain.vue') },
            { path: '/shared-diary/:roomId', name: 'SharedDiaryList', component: () => import('../pages/shareddiary/views/SharedDiaryList.vue') },
            { path: '/shared-diary/:roomId/write', name: 'SharedDiaryWrite', component: () => import('../pages/shareddiary/views/SharedDiaryWrite.vue') },
            { path: '/shared-diary/:roomId/diary/:diaryId', name: 'SharedDiaryDetail', component: () => import('../pages/shareddiary/views/SharedDiaryDetail.vue') }
        ]
    },
    // ⭐ login, signup은 DefaultLayout 없이 따로!
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'SignUp', component: SignUp }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router