<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
function setRealVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}
setRealVh()
window.addEventListener('resize', setRealVh)
</script>

<style src="./style.css">
.container {
  height: calc(var(--vh, 1vh) * 100);
  /* padding: 2rem; */
  padding: 40px;
  background-color: var(--color-beige);
}

@media (max-width: 768px) {
  .container {
    padding: 24px;
  }
}
</style>