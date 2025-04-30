import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LandingPage from '@/components/LandingPage.vue'
import Home from '@/pages/Home.vue'
import MyDiaryMine from '@/pages/mydiary/views/MyDiaryMine.vue'
import SharedDiaryMain from '@/pages/shareddiary/views/SharedDiaryMain.vue'
import MyPage from '@/pages/users/views/MyPage.vue'
import LoginPage from '@/pages/users/views/Login.vue'
import SignUp from '@/pages/users/views/SignUp.vue'
import FindId from '@/pages/users/views/FindId.vue'
import MonthlyDiary from '../modules/myDiary/views/MonthlyDiary.vue'
import WeeklyDiary from '../modules/myDiary/views/WeeklyDiary.vue'
import RegistMyDiary from '../modules/myDiary/views/RegistMyDiary.vue'

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: LandingPage,
    },
    {
        path: '/app',
        redirect: { name: 'Home' },
        component: DefaultLayout,
        children: [
            { path: 'home', name: 'Home', component: Home },
            { path: 'monthlydiary', name: 'MonthlyDiary', component: () => import('../modules/myDiary/views/MonthlyDiary.vue') },
            { path: 'weeklydiary', name: 'WeeklyDiary', component: () => import('../modules/myDiary/views/WeeklyDiary.vue') },
            { path: 'registmydiary', name: 'RegistMyDiary', component: () => import('../modules/myDiary/views/RegistMyDiary.vue') },
            {
                path: 'mypage',
                redirect: { name: 'MyPageInfo' },
                component: () => import('@/pages/users/views/MyPage.vue'),
                children: [
                    { path: 'info', name: 'MyPageInfo', component: () => import('@/pages/myPage/views/MyPageInfo.vue')},
                    { path: 'pet', name: 'MyPagePet', component: () => import('@/pages/myPage/views/MyPagePet.vue')},
                    { path: 'recommend', name: 'MyPageRecommend', component: () => import('@/pages/myPage/views/MyPageRecommend.vue')},
                ]
            },
            { path: 'login', name: 'Login', component: LoginPage },
            { path: 'shareddiary', name: 'SharedDiaryRoom', component: () => import('../pages/shareddiary/views/SharedDiaryMain.vue') },
            { path: '/shared-diary/:roomId', name: 'SharedDiaryList', component: () => import('../pages/shareddiary/views/SharedDiaryList.vue') },
            { path: '/shared-diary/:roomId/write', name: 'SharedDiaryWrite', component: () => import('../pages/shareddiary/views/SharedDiaryWrite.vue') },
            { path: '/shared-diary/:roomId/diary/:diaryId', name: 'SharedDiaryDetail', component: () => import('../pages/shareddiary/views/SharedDiaryDetail.vue') },

            {
                path: 'shareddiary',
                redirect: 'shareddiary/room', // ✅ 클릭하면 자동으로 /room으로 이동
                children: [
                    { path: 'room', name: 'SharedDiaryRoom', component: SharedDiaryMain },
                    { path: ':roomId', name: 'SharedDiaryList', component: () => import('@/pages/shareddiary/views/SharedDiaryList.vue') },
                    { path: ':roomId/write', name: 'SharedDiaryWrite', component: () => import('@/pages/shareddiary/views/SharedDiaryWrite.vue') },
                    { path: ':roomId/diary/:diaryId', name: 'SharedDiaryDetail', component: () => import('@/pages/shareddiary/views/SharedDiaryDetail.vue') },
                    { path: ':roomId/edit/:diaryId', name: 'SharedDiaryEdit', component: () => import('@/pages/shareddiary/views/SharedDiaryEdit.vue') }
                ]
            },
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