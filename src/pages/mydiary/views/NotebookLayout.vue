<template>
    <div class="notebook-wrapper">
        <div v-for="(page, index) in pages" :key="page.id" class="notebook-page" :style="{ zIndex: page.z }">
            <!-- 좌측 노트 영역 -->
            <div class="page-left">
                <h2 class="page-title">{{ page.title }}</h2>
                <div class="emotion-summary">
                    <div class="score-card">
                        <p>긍정 감정 점수: 48</p>
                        <p>보통 감정 점수: 26</p>
                        <p>부정 감정 점수: 26</p>
                    </div>
                    <ul class="summary-list">
                        <li>일상 속의 소소한 기쁨</li>
                        <li>사람들과의 따뜻한 교감</li>
                        <li>여유롭고 즐거운 여가 시간</li>
                    </ul>
                    <div class="recommend-actions">
                        <ul>
                            <li>행동 1</li>
                            <li>행동 2</li>
                            <li>행동 3</li>
                        </ul>
                    </div>
                </div>
                <div class="image-upload">대표 이미지 등록</div>
            </div>

            <!-- 우측 일기 작성 영역 -->
            <div class="page-right">
                <input type="text" placeholder="일기 제목을 입력하세요" class="diary-title" />
                <div class="image-box">사진</div>
                <textarea class="memo" placeholder="일기 내용을 입력하세요..."></textarea>
                <div class="bottom-tools">
                    <div class="image-box">사진</div>
                    <div class="sticker">⭐ 스티커</div>
                </div>
            </div>

            <!-- 탭 인덱스 -->
            <button class="tab-index" :class="{ active: index === currentIndex }"
                :style="{ top: `${120 + index * 72}px` }" @click="bringToFront(index)">
                {{ page.label }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const pages = ref([
    { id: 1, label: '내 일기', title: '내 일기', z: 1 },
    { id: 2, label: '우리 일기', title: '우리 일기', z: 2 },
    { id: 3, label: '요즘 내 기분', title: '요즘 내 기분', z: 3 },
    { id: 4, label: '자유 노트', title: '자유 노트', z: 4 }
])

const currentIndex = ref(3) // 기본값은 마지막 (자유 노트)

function bringToFront(index) {
    const maxZ = Math.max(...pages.value.map(p => p.z))
    pages.value[index].z = maxZ + 1
    currentIndex.value = index
}
</script>

<style scoped>
.notebook-wrapper {
    position: relative;
    width: 1400px;
    height: 900px;
    margin: 0 auto;
    background-color: #fdfcf7;
    border-radius: 24px;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.08);
    overflow: visible;
}

.notebook-page {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fffefb;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 40px;
    transition: all 0.4s ease;
}

.page-left,
.page-right {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 100% 32px;
    border-radius: 12px;
}

.page-title {
    font-size: 20px;
    font-weight: bold;
    color: #3b2b1c;
}

.emotion-summary .score-card {
    background-color: #fef3c7;
    padding: 10px;
    border-radius: 8px;
}

.summary-list {
    list-style: disc;
    padding-left: 20px;
    font-size: 14px;
}

.recommend-actions ul {
    list-style: square;
    padding-left: 18px;
    font-size: 14px;
}

.image-upload {
    background: #e0e0e0;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.diary-title {
    font-size: 18px;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 8px;
}

.image-box {
    width: 100%;
    height: 180px;
    background: #ddd;
    text-align: center;
    line-height: 180px;
    border-radius: 8px;
}

.memo {
    flex: 1;
    width: 100%;
    background: transparent;
    border: none;
    resize: none;
    font-size: 16px;
    font-family: var(--font-hand);
}

.bottom-tools {
    display: flex;
    gap: 20px;
    align-items: center;
}

.sticker {
    font-size: 18px;
    font-family: var(--font-omyu);
}

.tab-index {
    position: absolute;
    right: -50px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    background-color: var(--color-green);
    color: #fff;
    padding: 8px 12px;
    font-size: 14px;
    font-family: var(--font-omyu);
    border: none;
    border-radius: 6px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
}

.tab-index.active {
    background-color: #fff;
    color: var(--color-green);
    border: 1px solid var(--color-green);
}
</style>