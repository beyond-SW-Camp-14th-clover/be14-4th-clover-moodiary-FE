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
                        <div 
                            v-for="(cell, idx) in calendarCells" 
                            :key="idx" 
                            class="calendar-cell" 
                            :class="{ 
                                'prev-month': cell.type === 'prev',
                                'next-month': cell.type === 'next',
                                'has-diary': getDiaryForDay(cell.day)
                            }"
                            @click="cell.type === 'current' && getDiaryForDay(cell.day) && goToDailyDiary(cell.day)"
                        >
                            <div class="cell-header">
                                <span
                                    :style="{
                                        color:
                                            cell.type === 'current'
                                                ? (idx % 7 === 0 ? '#CA4C4C' : '#535353')
                                                : '#C2C2C2'
                                    }"
                                >{{ cell.day }}</span>
                                <div v-if="cell.type === 'current' && getDiaryForDay(cell.day)" class="score-circle">
                                    <span class="score-text" :style="{ color: getDiaryForDay(cell.day).totalScore ? getScoreColor(getDiaryForDay(cell.day).totalScore) : '#C2C2C2' }">{{ getDiaryForDay(cell.day).totalScore ?? '-' }}</span>
                                </div>
                            </div>
                            <div v-if="cell.type === 'current' && getDiaryForDay(cell.day)" class="cell-content">
                                <div v-if="getDiaryForDay(cell.day).photoUrl" class="cell-image">
                                    <img :src="getDiaryForDay(cell.day).photoUrl" alt="일기 사진" />
                                </div>
                                <span v-if="!getDiaryForDay(cell.day).photoUrl" class="title-text">{{ getDiaryForDay(cell.day).title }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-section">
                <div class="happy-section">
                    <h3>what makes me happy</h3>
                    <div class="section-underline2"></div>
                    <div v-for="(entry, index) in topThreeEntries" :key="index" class="entry-container">
                        <div class="happy-entry">
                            <div class="score-box">
                                <span class="score-text" :style="{ color: entry.totalScore ? getScoreColor(entry.totalScore) : '#C2C2C2' }">{{ entry.totalScore ?? '-' }}</span>
                            </div>
                            <div class="entry-title">{{ entry.title }}</div>
                        </div>
                        <div class="section-underline2 section-underline2-margin"></div>
                    </div>
                </div>
                <div class="sad-section">
                    <h3>what makes me sad</h3>
                    <div class="section-underline2"></div>
                    <div v-for="(entry, index) in bottomThreeEntries" :key="index" class="entry-container">
                        <div class="sad-entry">
                            <div class="score-box">
                                <span class="score-text" :style="{ color: entry.totalScore ? getScoreColor(entry.totalScore) : '#C2C2C2' }">{{ entry.totalScore ?? '-' }}</span>
                            </div>
                            <div class="entry-title">{{ entry.title }}</div>
                        </div>
                        <div class="section-underline2 section-underline2-margin"></div>
                    </div>
                </div>
                <Moodlog />
                <div class="stats">
                    <EmotionRates 
                        :positive-score="emotionScores.positive"
                        :neutral-score="emotionScores.neutral"
                        :negative-score="emotionScores.negative"
                    />
                    <EmotionBarChart :diary-data="diaryEntries" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDailyDiaryStore } from '../../../stores/dailyDiaryStore';
import EmotionRates from '../components/EmotionRates.vue';
import EmotionBarChart from '../components/EmotionBarChart.vue';
import Moodlog from '../components/Moodlog.vue';
import axios from 'axios';

const router = useRouter();
const dailyDiaryStore = useDailyDiaryStore();
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

    diaryEntries.value = [];
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const targetMonth = `${year}-${month}`;
    fetchMonthlyDiary(targetMonth);
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
    const scores = {
        positive: 0,
        neutral: 0,
        negative: 0
    };

    diaryEntries.value.forEach(entry => {
        if (entry.totalScore <= 33) {
            scores.negative += 1;
        } else if (entry.totalScore <= 66) {
            scores.neutral += 1;
        } else {
            scores.positive += 1;
        }
    });

    return scores;
});

const diaryEntries = ref([]);

const fetchMonthlyDiary = async (targetMonth) => {
    try {
        console.log('월간 일기 조회 요청:', `/mydiary/monthly`);
        const response = await axios.get(`/mydiary/monthly`, {
            params: {
                targetMonth
            }
        });
        console.log('백엔드 응답 데이터:', response.data);
        diaryEntries.value = response.data;
    } catch (error) {
        console.error('Axios error:', error);
        diaryEntries.value = [];
    }
};

const getDiaryForDay = (day) => {
    const entry = diaryEntries.value.find(entry => new Date(entry.createdAt).getDate() === day);
    if (entry && entry.styleLayer) {
        try {
            const parsedStyleLayer = JSON.parse(entry.styleLayer);
            if (parsedStyleLayer.sticker && parsedStyleLayer.sticker.length > 0) {
                const photo = parsedStyleLayer.sticker.find(s => s.type === 'photo');
                if (photo) {
                    entry.photoUrl = photo.url;
                }
            }
        } catch (e) {
            console.error('styleLayer 파싱 에러:', e);
        }
    }
    return entry;
};

const getScoreColor = (score) => {
    if (score <= 33) return '#A60303';
    if (score <= 66) return '#DA930E';
    return '#346FD2';
};

const topThreeEntries = computed(() => {
    return [...diaryEntries.value]
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 3);
});

const bottomThreeEntries = computed(() => {
    return [...diaryEntries.value]
        .sort((a, b) => a.totalScore - b.totalScore)
        .slice(0, 3);
});

const goToDailyDiary = (day) => {
    const date = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), day);
    date.setHours(12, 0, 0, 0); // 시간을 정오로 설정하여 시간대 문제 방지
    dailyDiaryStore.setPreviousPage('monthly', date);
    router.push({ name: 'DailyMyDiaryWithDate', params: { date: date.toISOString().split('T')[0] } });
};

onMounted(() => {
    const year = selectedDate.value.getFullYear();
    const month = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0');
    const targetMonth = `${year}-${month}`;
    fetchMonthlyDiary(targetMonth);
});
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-top: 10px;
}

.month-display {
    font-family: 'Akshar', sans-serif;
    font-weight: 400;
    font-size: 24px;
    color: #535353;
    margin-bottom: 0;
    line-height: 1;
    position: relative;
    z-index: 1;
}

.month-navigation {
    display: flex;
    gap: 0.5rem;
}

.month-navigation button {
    all: unset !important;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    background: none !important;
    border: none !important;
    outline: none;
    box-shadow: none !important;
    color: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: normal !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
}

.month-navigation button:hover {
    background: none !important;
    transform: none !important;
}

.month-navigation button:active {
    transform: none !important;
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
    margin-top: -3px;
    position: relative;
    z-index: 0;
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
    position: relative;
    border: 1px solid #F7F2EB;
    text-align: left;
    padding: 0;
    font-size: 1rem;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 121px;
    cursor: pointer;
    transition: background-color 0.2s;
    overflow: hidden;
}
.calendar-cell:hover {
    background-color: #F7F2EB;
}
.calendar-cell:not(.has-diary) {
    cursor: default;
}
.calendar-cell:not(.has-diary):hover {
    background-color: #fff;
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
    margin-top: -20px;
}
.section-underline2 {
    width: 350px;
    height: 3px;
    background-color: #F7F2EB;
    margin-top: -10px;
}
.section-underline2-margin {
    margin-top: 30px;
}
.sad-section {
    margin-top: 50px;
}
.moodlog {
    margin-top: 50px;
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
    background-color: #FFE7C9 !important;
    color: #535353 !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 4px 12px !important;
    font-family: var(--font-akshar) !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    cursor: pointer !important;
    transition: background-color 0.3s !important;
    margin-right: 30px !important;
    outline: none !important;
    box-shadow: none !important;
    text-decoration: none !important;
    display: inline-block !important;
    line-height: normal !important;
    text-align: center !important;
    vertical-align: middle !important;
}

.save-button:hover {
    background-color: #FFC985 !important;
}

.stats {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 40px;
}

.score-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.score-box {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Akshar', sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #535353;
}

.score-circle {
    background-color: #FFFFFF;
    z-index: 1;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transform: translate(2px, -1px);
}

.score-text {
    font-family: 'Akshar', sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: inherit;
}

.score-text:empty::before {
    content: '-';
    color: #C2C2C2;
}

.cell-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: relative;
    z-index: 2;
    padding: 0.5rem;
    box-sizing: border-box;
}

.cell-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.cell-image {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
}

.cell-image img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.title-text {
    position: absolute;
    top: calc(50% + 5px);
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    display: block;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 16px;
    color: #535353;
    margin: 0;
    padding: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 2;
    text-align: center;
    transition: background-color 0.2s;
}

.calendar-cell:hover .title-text {
    background-color: rgba(247, 242, 235, 0.8);
}

.entry-container {
    margin-bottom: 15px;
}

.happy-entry, .sad-entry {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 20px;
    margin-top: 15px;
}

.section-underline2-margin {
    margin-top: 0px;
}

.entry-title {
    font-family: 'Akshar', sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: #525252;
    line-height: 20px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
}
</style>