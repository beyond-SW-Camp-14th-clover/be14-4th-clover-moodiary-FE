<template>
    <header class="header-bg">
        <div class="header-inner">
            <!-- 로고 -->
            <a href="/"><img src="../assets/logo.png" class="logo" /></a>

            <!-- 내비게이션 -->
            <nav class="nav-links">
                <a href="/mydiary">서랍 속 작은 일기장</a>
                <a href="/ourdiary">알 수 없는 너의 비밀</a>
                <a href="/myemotion">내 맘속에 담아</a>
                <a href="/mypage">너 몰래</a>
            </nav>

            <!-- 로그인 버튼 -->
            <router-link to="/login" class="button">로그인</router-link>
        </div>
    </header>
</template>

<script setup>
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
.logo {
    width: 250px;
}

/* 네비게이션 링크 */
.nav-links {
    display: flex;
    gap: 20px;
}

.nav-links a {
    color: var(--color-beige);
    text-decoration: none;
    font-size: 24px;
    font-family: var(--font-omyu);
}
</style>