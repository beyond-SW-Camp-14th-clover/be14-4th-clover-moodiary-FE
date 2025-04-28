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
            </div>
            <div class="right-section">
                <div class="happy-section">
                    <h3>what makes me happy</h3>
                    <div class="section-underline2"></div>
                </div>
                <div class="sad-section">
                    <h3>what makes me sad</h3>
                    <div class="section-underline2"></div>
                </div>
                <div class="moodlog">
                    <div class="moodlog-header">
                        <h3>moodlog</h3>
                        <button class="save-button">저장</button>
                    </div>
                    <div class="moodlog-content">
                        <div class="moodlog-textbox">
                            <textarea placeholder="이번 달 나의 기록"></textarea>
                        </div>
                    </div>
                </div>
                <div class="stats">
                    <EmotionRates 
                        :positive-score="emotionScores.positive"
                        :neutral-score="emotionScores.neutral"
                        :negative-score="emotionScores.negative"
                    />
                    <EmotionBarChart />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import EmotionRates from '../components/EmotionRates.vue';
import EmotionBarChart from '../components/EmotionBarChart.vue';

const selectedDate = ref(new Date());

const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const selectedMonth = computed(() => {
    const month = monthNames[selectedDate.value.getMonth()];
    const year = selectedDate.value.getFullYear();
    return `${month} ${year}`;
});

const changeMonth = (change) => {
    const newDate = new Date(selectedDate.value);
    newDate.setMonth(newDate.getMonth() + change);
    selectedDate.value = newDate;
};

const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (year, month) => {
    return new Date(year, month, 1).getDay();
};

const calendarCells = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = daysInMonth(prevYear, prevMonth);
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
        cells.push({
            day: prevMonthDays - firstDay + i + 1,
            type: 'prev',
        });
    }

    for (let d = 1; d <= days; d++) {
        cells.push({
            day: d,
            type: 'current',
        });
    }

    let nextDay = 1;
    while (cells.length % 7 !== 0) {
        cells.push({
            day: nextDay++,
            type: 'next',
        });
    }
    return cells;
});

const emotionScores = computed(() => {
    return {
        positive: 0,
        neutral: 0,
        negative: 0
    };
});
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
    margin-top: 35px;
}
.calendar-header-cell {
    text-align: center;
    font-weight: 300;
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
.left-section {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 80px;
    margin-right: 60px;
}
.right-section {
    flex: 1;
    margin-right: 70px;
}
.my-diary-header {
    margin-top: 30px;
    width: 100%;
}
.happy-section h3, .sad-section h3, .moodlog h3 {
    font-family: var(--font-akshar);
    font-weight: 200;
    font-size: 24px;
    color: #535353;
}
.section-underline2 {
    width: 350px;
    height: 3px;
    background-color: #F7F2EB;
    margin-top: -10px;
}
.moodlog-textbox {
    width: 350px;
    height: 168px;
    background-color: rgba(247, 242, 235, 0.5);
    border-radius: 5px;
    padding: 30px;
    box-sizing: border-box;
    margin-bottom: 20px;
}

.moodlog-textbox textarea {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    resize: none;
    font-family: 'Omyu Pretty', sans-serif;
    font-size: 16px;
    color: #535353;
    outline: none;
}

.moodlog-textbox textarea::placeholder {
    color: #535353;
    opacity: 0.5;
}

.moodlog-content {
    margin-top: 5px;
    position: relative;
}

.moodlog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.save-button {
    background-color: #FFE7C9;
    color: #535353;
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    font-family: var(--font-akshar);
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 5px;
}

.save-button:hover {
    background-color: #FFC985;
}

.stats {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 40px;
}
</style>