<template>
  <div id="app" class="container">
    <main class="content">
      <router-view />
    </main>
    <MP />
  </div>
</template>

<script setup>
import MP from '@/components/common/MusicPlayer.vue'

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
  display: flex;
  flex-direction: column;
  background-color: var(--color-beige);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>