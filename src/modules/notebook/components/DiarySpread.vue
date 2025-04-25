<template>
    <div class="spread">
        <DateIndex />
        <div class="pages">
            <LeftPage />
            <RightPage />
        </div>
    </div>
</template>

<script setup>
import DateIndex from './DateIndex.vue'
import LeftPage from './LeftPage.vue'
import RightPage from './RightPage.vue'
</script>

<style scoped>
.spread {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.pages {
    display: flex;
    gap: 20px;
}
</style>