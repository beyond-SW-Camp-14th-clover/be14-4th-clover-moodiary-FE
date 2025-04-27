<template>
    <header class="header-bg">
        <div class="header-inner">
            <!-- 로고 -->
            <div class="logo"><router-link to="/">MOODI:ARY</router-link></div>

            <!-- 내비게이션 -->
            <nav class="nav-links">
                <div class="menu-wrapper">
                    <span class="menu-button">서랍 속 작은 일기장</span>
                    <div class="submenu">
                        <router-link to="/mydiary/mydiarymine">내 일기</router-link>
                        <router-link to="/mydiary/emotion">월간</router-link>
                        <router-link to="/mydiary/ours">주간</router-link>
                    </div>
                </div>
                <div class="menu-wrapper">
                    <span class="menu-button">알 수 없는 너의 비밀</span>
                    <div class="submenu">
                        <router-link to="/shareddiary">우리 일기</router-link>
                    </div>
                </div>
                <div class="menu-wrapper">
                    <span class="menu-button">내 맘속에 담아</span>
                    <div class="submenu">
                        <router-link to="/myemotion">감정 분석</router-link>
                    </div>
                </div>
                <div class="menu-wrapper">
                    <span class="menu-button">너 몰래</span>
                    <div class="submenu">
                        <router-link to="/mypage">내 정보 수정</router-link>
                        <router-link to="/logout">로그아웃</router-link>
                    </div>
                </div>
            </nav>

            <!-- 로그인 버튼 -->
            <router-link to="/login" class="button submit-button">로그인</router-link>
        </div>
    </header>
</template>

<script setup>
import MusicPlayer from './common/MusicPlayer.vue'
</script>

<style scoped>
.header-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 80px;
    background-color: var(--color-brown);
    z-index: 9999;
}

.header-inner {
    width: 100%;
    max-width: 1920px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    box-sizing: border-box;
}

/* 로고 */
.logo a {
    width: 250px;
    color: var(--color-beige);
    font-family: var(--font-pixel);
    font-size: 2rem;
    font-weight: 800;
    text-decoration: none;
    text-shadow: 1px 1px 3px var(--color-beige);
}

/* 네비게이션 */
.nav-links {
    display: flex;
    gap: 50px;
    align-items: center;
}

/* 일반 링크 */
.nav-links a {
    color: var(--color-beige);
    text-decoration: none;
    font-size: 24px;
    font-family: var(--font-omyu);
}

/* 메뉴 래퍼 */
.menu-wrapper {
    position: relative;
}

/* 메인 메뉴 */
.menu-button {
    color: var(--color-beige);
    font-size: 24px;
    font-family: var(--font-omyu);
    cursor: pointer;
}

/* 서브 메뉴 */
.submenu {
    position: absolute;
    top: 36px;
    left: 0;
    background-color: var(--color-beige);
    border: 2px solid var(--color-brown);
    border-radius: 20px;
    padding: 12px 20px;
    display: none;
    flex-direction: column;
    gap: 10px;
    min-width: 180px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* hover 시 서브 메뉴 노출 */
.menu-wrapper:hover .submenu {
    display: flex;
    animation: fadeIn 0.3s ease-in-out;
}

/* 서브 메뉴 항목 */
.submenu a {
    color: var(--color-brown);
    font-family: var(--font-omyu);
    font-size: 18px;
    text-decoration: none;
    transition: color 0.2s;
}

.submenu a:hover {
    color: var(--color-green);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>