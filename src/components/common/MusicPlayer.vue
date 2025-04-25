<template>
    <div class="hidden-music">
        <iframe width="0" height="0"
            :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=0`"
            frameborder="0" allow="autoplay"></iframe>
    </div>
</template>

<script setup>
const videoId = 'p3dxVQsDwyU' // 재생할 YouTube 영상 ID
</script>

<style scoped>
.hidden-music {
    width: 0;
    height: 0;
    overflow: hidden;
    position: absolute;
}
</style>