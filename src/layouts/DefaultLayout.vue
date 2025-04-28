<template>
    <div class="layout-wrapper">
        <Header />
        <main>
            <router-view />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
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