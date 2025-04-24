<template>
    <header class="header-bg">
        <div class="header-inner">
            <h1 class="logo">MOODIARY</h1>
            <nav>
                <a href="/">홈</a>
                <a href="/write">일기쓰기</a>
                <a href="/stats">통계</a>
            </nav>
        </div>
    </header>
</template>

<script setup>
// 스크립트가 필요 없다면 비워둬도 무방
</script>

<style scoped>
/* 배경: 전체 화면 너비 */
.header-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 60px;
    background-color: var(--color-brown);
    z-index: 9999;
}

/* 안쪽 컨텐츠: 중앙 고정 + max-width */
.header-inner {
    width: 100%;
    max-width: 1920px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    box-sizing: border-box;
}

/* 로고 스타일 */
.logo {
    font-family: var(--font-omyu);
    font-size: 24px;
    color: var(--color-beige);
    margin: 0;
}

/* 내비게이션 링크 스타일 */
nav a {
    margin-left: 20px;
    color: var(--color-beige);
    text-decoration: none;
    font-size: 16px;
    font-family: var(--font-omyu);
}
</style>