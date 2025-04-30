<template>
    <div class="layout-wrapper">
      <!-- Header 에서 로그인 요청을 emit -->
      <Header @open-login="showLogin = true" />
  
      <main>
        <router-view />
        <!-- 로그인 모달 -->
        <LoginModal v-model:show="showLogin" />
      </main>
  
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Header from '@/components/Header.vue'
  import Footer from '@/components/Footer.vue'
  import LoginModal from '@/components/LoginModal.vue'
  
  // 로그인 모달 표시 상태
  const showLogin = ref(false)
  </script>
  
  <style scoped>
  .layout-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  </style>
  