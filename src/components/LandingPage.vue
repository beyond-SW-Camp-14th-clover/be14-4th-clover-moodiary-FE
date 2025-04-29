<template>
    <transition name="fade">
      <div v-if="visible" class="landing-page">
        <img
          src="@/assets/landing/landingbook.gif"
          alt="책 이미지"
          class="book"
          @click="goHome"
        />
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const visible = ref(true)
  
  function goHome() {
    // 1) 페이드아웃 트리거
    visible.value = false
    // 2) 페이드아웃 애니메이션(0.5s) 후 라우팅
    setTimeout(() => {
      router.push('/app/home')
    }, 500)
  }
  </script>
  
  <style scoped>
  /* 페이드 트랜지션 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 페이지 레이아웃 */
  .landing-page {
    height: 100vh;
    background: var(--simmered-daikon-yellow);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .book {
    width: 800px;
    height: auto;
    cursor: pointer;
    transform: translateY(-100px);
  }
  </style>
  