import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Home from '@/pages/Home.vue'
import MyDiaryMine from '@/pages/mydiary/views/MyDiaryMine.vue'
import SharedDiaryMain from '@/pages/shareddiary/views/SharedDiaryMain.vue'
import MyPage from '@/pages/users/views/MyPage.vue'
import LoginPage from '@/pages/users/views/Login.vue'
import SignUp from '@/pages/users/views/SignUp.vue'
import FindId from '@/pages/users/views/FindId.vue'
import SentimentAnalysis from '@/pages/sa/views/SentimentAnalysis.vue'

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', name: 'Home', component: Home },
            {
                path: 'mydiary',
                children: [
                    { path: 'mydiarymine', name: 'MyDiaryMine', component: MyDiaryMine }
                ]
            },
            {
                path: 'shareddiary',
                redirect: '/shareddiary/room', // ✅ 클릭하면 자동으로 /room으로 이동
                children: [
                    { path: 'room', name: 'SharedDiaryRoom', component: SharedDiaryMain },
                    { path: ':roomId', name: 'SharedDiaryList', component: () => import('@/pages/shareddiary/views/SharedDiaryList.vue') },
                    { path: ':roomId/write', name: 'SharedDiaryWrite', component: () => import('@/pages/shareddiary/views/SharedDiaryWrite.vue') },
                    { path: ':roomId/diary/:diaryId', name: 'SharedDiaryDetail', component: () => import('@/pages/shareddiary/views/SharedDiaryDetail.vue') }
                ]
            },
            { path: 'mypage', name: 'MyPage', component: MyPage },
            { path: 'sa', name: 'SentimentAnalysis', component: SentimentAnalysis }
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