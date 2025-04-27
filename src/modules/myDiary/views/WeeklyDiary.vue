<template>
    <div class="background-paper">
        <div class="my-diary-header">
            <div class="header-content">
                <div class="month-navigation">
                    <button @click="changeMonth(-1)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 6L9 12L15 18" stroke="#535353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="month-container">
                        <h1 class="month-display">{{ selectedMonth }}</h1>
                        <div class="month-underline"></div>
                    </div>
                    <button @click="changeMonth(1)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 6L15 12L9 18" stroke="#535353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="content-container">
            <div class="left-section">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentDate = ref(new Date());

const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const selectedMonth = computed(() => {
    const month = monthNames[currentDate.value.getMonth()];
    const year = currentDate.value.getFullYear();
    return `${month} ${year}`;
});

const changeMonth = (change) => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() + change);
    currentDate.value = newDate;
};
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-top: 20px;
}

.month-display {
    font-family: 'Akshar', sans-serif;
    font-weight: 400;
    font-size: 24px;
    color: #535353;
    margin-bottom: -10px;
}

.month-navigation {
    display: flex;
    gap: 0.5rem;
}

.month-navigation button {
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
}

.month-navigation button:hover {
    background: none;
}

.month-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.month-underline {
    width: 152px;
    height: 3px;
    background-color: #F7F2EB;
}

.background-paper {
    position: absolute;
    left: 50%;
    top: 125px;
    width: 1413px;
    height: 914px;
    background-color: #FFFFFF;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
}

.content-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1;
}

.left-section {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 80px;
    margin-right: 60px;
}

.my-diary-header {
    margin-top: 30px;
    width: 100%;
}
</style>