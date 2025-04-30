<template>
  <div class="moodi-diary">
    <div class="top-section">
      <div class="content">
        <!-- 로고 텍스트 -->
        <div class="moodi-ary">MOODI:ARY</div>
        <!-- 설명 -->
        <div class="description">
          <span class="headline">
            하루의 감정을 기록하고, 더 나은 나를 만나다<br /><br />
          </span>
          <span class="subtext">
            당신의 일기를 감정 분석으로 세심하게 살펴 그날의 기분을 알려주고,<br />
            맞춤형 행동 추천으로 하루를 더 풍요롭게 만들어 드립니다.<br />
            소중한 추억은 공유 일기 기능으로 사랑하는 사람들과 함께 간직하세요.<br />
            지금, 감정 다이어리로 나만의 이야기를 시작해 보세요!
          </span>
        </div>
        <!-- 특징 아이콘 -->
        <div class="features">
          <div class="feature-item">
            <img src="@/assets/landing/icons1.png" alt="icon" />
            <p>매일 일기를 작성</p>
          </div>
          <div class="feature-item">
            <img src="@/assets/landing/icons2.png" alt="icon" />
            <p>감정 분석을 통한 그날의 기분 확인</p>
          </div>
          <div class="feature-item">
            <img src="@/assets/landing/icons3.png" alt="icon" />
            <p>캘린더를 통해 한눈에 추억 확인하기</p>
          </div>
          <div class="feature-item">
            <img src="@/assets/landing/icons4.png" alt="icon" />
            <p>그림일기 형식으로 저장 가능!</p>
          </div>
        </div>
      </div>

      <div class="cover">
        <!-- 왼쪽 화살표 -->
        <button
          class="nav-btn left"
          @click="prevCover"
          :disabled="currentIndex === 0"
        >
          ‹
        </button>

        <!-- 이미지 페이드 전환 -->
        <transition name="fade" mode="out-in">
          <img
            class="background-image"
            :src="coverImages[currentIndex]"
            :key="currentIndex"
            alt="cover"
          />
        </transition>

        <!-- 오른쪽 화살표 -->
        <button
          class="nav-btn right"
          @click="nextCover"
          :disabled="currentIndex === coverImages.length - 1"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 슬라이드할 이미지를 import
import cover1 from '@/assets/landing/homepic.png'
import cover2 from '@/assets/landing/homepic2.png'

const coverImages = [cover1, cover2]
const currentIndex = ref(0)

function prevCover() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function nextCover() {
  if (currentIndex.value < coverImages.length - 1) {
    currentIndex.value++
  }
}
</script>

<style scoped>
/* 전체 컨테이너 */
.moodi-diary {
  background: var(--color-beige);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

/* 상단 섹션(텍스트 + 커버) */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

/* 왼쪽 텍스트 영역 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  max-width: 600px;
}

/* 로고 텍스트 */
.moodi-ary {
  font-family: var(--font-pixel);
  font-size: 2rem;
  color: var(--color-brown);
}

/* 설명 텍스트 */
.description .headline,
.description .subtext {
  font-family: var(--font-omyu);
  color: var(--color-brown);
}

.description .headline {
  font-size: 2.5rem;
  line-height: 0.8;
}

.description .subtext {
  font-size: 1rem;
  line-height: 1.6;
}

/* 특징 아이콘 영역 */
.features {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  max-width: 700px;
  margin-top: 24px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-item img {
  width: 36px;
  height: 36px;
}

.feature-item p {
  margin-top: 8px;
  font-size: 0.75rem;
  color: var(--color-brown);
  text-align: center;
}

/* 커버(이미지 슬라이드) 영역 */
.cover {
  position: relative;
  flex-shrink: 0;
  width: 850px;
  height: auto;
  overflow: hidden;
  border-radius: 12px;
  background: #2f2f2f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 네비게이션 버튼 (화살표만) */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  border-radius: 100%;
  color: var(--color-brown);
  font-size: 2rem;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.nav-btn.left {
  left: 8px;
}

.nav-btn.right {
  right: 8px;
}

/* 페이드 전환 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 반응형: 모바일에서는 넓이를 90vw로 */
@media (max-width: 768px) {
  .cover {
    width: 90vw;
  }
}
</style>
