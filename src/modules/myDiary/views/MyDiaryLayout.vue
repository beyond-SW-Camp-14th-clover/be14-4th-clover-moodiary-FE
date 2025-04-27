<template>
    <background-paper class="background-paper">
        <my-diary-header>
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
        </my-diary-header>
        <left-section>
            <div class="calendar-container">
                <div class="calendar-header">
                    <div v-for="day in weekDays" :key="day" class="calendar-header-cell">{{ day }}</div>
                </div>
                <div class="calendar-body">
                    <div v-for="(cell, idx) in calendarCells" :key="idx" class="calendar-cell" :class="{ 'empty': cell.type !== 'current' }">
                        <span
                            :style="{
                                color:
                                    cell.type === 'current'
                                        ? (idx % 7 === 0 ? '#CA4C4C' : '#535353')
                                        : '#C2C2C2'
                            }"
                        >{{ cell.day }}</span>
                    </div>
                </div>
            </div>
        </left-section>
        <right-section>
            
        </right-section>
    </background-paper>
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

const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (year, month) => {
    return new Date(year, month, 1).getDay();
};

const calendarCells = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = daysInMonth(prevYear, prevMonth);
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const cells = [];
    // 앞 빈칸: 이전 달 날짜
    for (let i = 0; i < firstDay; i++) {
        cells.push({
            day: prevMonthDays - firstDay + i + 1,
            type: 'prev',
        });
    }
    // 이번 달 날짜
    for (let d = 1; d <= days; d++) {
        cells.push({
            day: d,
            type: 'current',
        });
    }
    // 뒤 빈칸: 다음 달 날짜
    let nextDay = 1;
    while (cells.length % 7 !== 0) {
        cells.push({
            day: nextDay++,
            type: 'next',
        });
    }
    return cells;
});
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
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
}

.calendar-container {
    width: 852px;
    height: 643px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}
.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #fff;
    border-bottom: 1px solid #eee;
    height: 50px;
}
.calendar-header-cell {
    text-align: center;
    font-weight: 400;
    font-family: 'Akshar', sans-serif;
    color: #535353;
    padding: 0.5rem 0;
    font-size: 24px;
    text-transform: lowercase;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.calendar-header-cell:first-child {
    color: #CA4C4C;
}
.calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    background: #fff;
    flex: 1 1 0;
    height: calc(100% - 50px);
}
.calendar-cell {
    border: 1px solid #F7F2EB;
    text-align: right;
    padding: 0.5rem;
    font-size: 1rem;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}
.calendar-cell.empty {
    background: none;
}
left-section {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 60px;
}
right-section {
    flex: 1;
}
</style>