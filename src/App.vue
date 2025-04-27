<template>
  <router-view />
  <MP />
</template>

<script setup>
import MP from '@/components/common/MusicPlayer.vue' // 경로는 @ 쓰면 깔끔 (아니면 상대경로도 괜찮아)

function setRealVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setRealVh()
window.addEventListener('resize', setRealVh)
</script>

<style scoped>
.container {
  height: calc(var(--vh, 1vh) * 100);
  padding: 40px;
  background-color: var(--color-beige);
}

@media (max-width: 768px) {
  .container {
    padding: 24px;
  }
}
</style>