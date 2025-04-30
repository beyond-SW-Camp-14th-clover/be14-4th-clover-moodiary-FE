import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LandingPage from '@/components/LandingPage.vue'
import Home from '@/pages/Home.vue'
import MyPage from '@/modules/user/views/MyPage.vue'
import LoginPage from '@/modules/user/views/Login.vue'
import SignUp from '@/modules/user/views/SignUp.vue'
import FindId from '@/modules/user/views/FindId.vue'

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: LandingPage,
    },
    {
        path: '/app',
        component: DefaultLayout,
        children: [
            { path: 'home', name: 'Home', component: Home },
            { path: 'monthlydiary', name: 'MonthlyDiary', component: () => import('../modules/myDiary/views/MonthlyDiary.vue') },
            { path: 'weeklydiary', name: 'WeeklyDiary', component: () => import('../modules/myDiary/views/WeeklyDiary.vue') },
            { path: 'registmydiary', name: 'RegistMyDiary', component: () => import('../modules/myDiary/views/RegistMyDiary.vue') },
            { path: 'mypage', name: 'MyPage', component: MyPage },
            { path: 'login', name: 'Login', component: LoginPage },
            { path: 'shareddiary/room', name: 'SharedDiaryRoom', component: () => import('../modules/shareddiary/views/SharedDiaryMain.vue') },
            { path: '/shared-diary/:roomId', name: 'SharedDiaryList', component: () => import('../modules/shareddiary/views/SharedDiaryList.vue') },
            { path: '/shared-diary/:roomId/write', name: 'SharedDiaryWrite', component: () => import('../modules/shareddiary/views/SharedDiaryWrite.vue') },
            { path: '/shared-diary/:roomId/diary/:diaryId', name: 'SharedDiaryDetail', component: () => import('../modules/shareddiary/views/SharedDiaryDetail.vue') },
            { path: '/sa', name: 'SentimentAnalysis', component: () => import('../modules/sa/views/SentimentAnalysis.vue') },
            { path: 'mypage', name: 'MyPage', component: MyPage }
        ]
    },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/findid', name: 'FindId', component: FindId }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 