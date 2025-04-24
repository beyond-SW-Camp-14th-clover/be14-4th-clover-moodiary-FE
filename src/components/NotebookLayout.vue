<template>
    <div class="notebook">
        <div v-for="(page, index) in pages" :key="page.id" class="notebook-page" :style="{ zIndex: page.z }">
            <div class="page-content">
                <div class="left-paper">{{ page.left }}</div>
                <div class="right-paper">{{ page.right }}</div>
            </div>

            <!-- 탭 -->
            <button class="tab-index" :style="{
                backgroundColor: page.color,
                top: `${100 + index * 80}px`,
                zIndex: 1000 + page.z // 탭 자체는 항상 위에 표시
            }" @click="bringToFront(index)">
                {{ page.label }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const pages = ref([
    { id: 1, label: '일기 목록', left: '왼쪽 내용', right: '오른쪽 메모', color: '#F5B7B1', z: 1 },
    { id: 2, label: '일기 목록', left: '왼쪽 2', right: '오른쪽 2', color: '#F9E79F', z: 2 },
    { id: 3, label: '일기 목록', left: '왼쪽 3', right: '오른쪽 3', color: '#ABEBC6', z: 3 },
    { id: 4, label: '행동 추천', left: '왼쪽 4', right: '오른쪽 4', color: '#AED6F1', z: 4 }
])

function bringToFront(index) {
    const maxZ = Math.max(...pages.value.map(p => p.z))
    pages.value[index].z = maxZ + 1
}
</script>

<style scoped>
.notebook {
    position: relative;
    width: 1400px;
    height: 900px;
    margin: 0 auto;
    overflow: visible;
}

.notebook-page {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fffefb;
    box-shadow: 0 0 0 4px #d8cbb3;
    border-radius: 24px;
    transition: all 0.3s ease;
}

.page-content {
    display: flex;
    padding: 40px 60px;
    height: 100%;
    gap: 20px;
}

.left-paper,
.right-paper {
    flex: 1;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 100% 32px;
    padding: 24px;
    border-radius: 12px;
    line-height: 1.8;
    font-family: var(--font-omyu);
    font-size: 16px;
    color: #3b2b1c;
}

.tab-index {
    position: absolute;
    right: -35px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    border: 1px solid #999;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
    font-family: var(--font-omyu);
    cursor: pointer;
    transition: transform 0.2s;
}

.tab-index:hover {
    transform: scale(1.05);
}
</style>