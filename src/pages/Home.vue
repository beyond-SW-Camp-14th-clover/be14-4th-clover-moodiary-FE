<template>
    <div class="moodi-diary">
      <div class="top-section">
        <div class="content">
          <div class="moodi-ary">MOODI:ARY</div>
          <div class="description">
            <span class="headline">
              하루의 감정을 기록하고, 더 나은 나를 만나다<br /><br />
            </span>
            <span class="subtext">
              당신의 일기를 감정 분석으로 세심하게 살펴 그날의 기분을 알려주고,
              맞춤형 행동 추천으로 하루를 더 풍요롭게 만들어 드립니다.<br />
              소중한 추억은 공유 일기 기능으로 사랑하는 사람들과 함께 간직하세요.<br />
              지금, 감정 다이어리로 나만의 이야기를 시작해 보세요!
            </span>
          </div>
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
            &#8249;
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
            &#8250;
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // ① 슬라이드할 이미지를 import
  import cover1 from '@/assets/landing/homepic.png'
  import cover2 from '@/assets/landing/homepic2.png'
  
  const coverImages = [cover1, cover2]
  
  // ③ 현재 인덱스
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
  .moodi-diary {
    background: var(--simmered-daikon-yellow);
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px;
    overflow: hidden;
  }
  
  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }
  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    max-width: 600px;
  }
  
  .moodi-ary {
    font-family: "PressStart2P-Regular", sans-serif;
    font-size: 24px;
    color: white;
  }
  
  .description { color: #333; }
  
  .headline {
    font-size: 24px;
    font-family: "SegoeUiSymbol-Regular", sans-serif;
    line-height: 30px;
  }
  
  .subtext {
    font-size: 18px;
    font-family: "SegoeUiSymbol-Regular", sans-serif;
    line-height: 30px;
  }
  
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
  .feature-item img { width: 36px; height: 36px; }
  .feature-item p {
    margin-top: 8px;
    font-size: 11px;
    color: #111;
    text-align: center;
  }
  
  /* cover 영역 */
  .cover {
    position: relative;
    flex-shrink: 0;
    width: 1000px;
    height: auto;
    overflow: hidden;
    border-radius: 12px;
    background: #2f2f2f;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 이미지 */
  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 화살표 버튼 */
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    color: white;
    font-size: 1rem;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: background-color 0.2s;
  }
  .nav-btn:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .nav-btn:disabled {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: default;
  }
  .nav-btn.left { left: 10px; }
  .nav-btn.right { right: 10px; }
  
  /* 페이드 애니메이션 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 반응형 */
  @media (max-width: 768px) {
    .cover {
      width: 250px;
      height: 350px;
    }
  }
  </style>
  