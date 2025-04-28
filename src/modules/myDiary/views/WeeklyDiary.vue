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
                <div class="week-navigation">
                    <div class="week-item">Week</div>
                    <div class="week-item" 
                         :class="{ active: selectedWeek === '1' }" 
                         @click="handleWeekSelect('1')">1</div>
                    <div class="week-item" 
                         :class="{ active: selectedWeek === '2' }" 
                         @click="handleWeekSelect('2')">2</div>
                    <div class="week-item" 
                         :class="{ active: selectedWeek === '3' }" 
                         @click="handleWeekSelect('3')">3</div>
                    <div class="week-item" 
                         :class="{ active: selectedWeek === '4' }" 
                         @click="handleWeekSelect('4')">4</div>
                    <div class="week-item" 
                         :class="{ 
                            active: selectedWeek === '5',
                            disabled: !hasFifthWeek
                         }" 
                         @click="handleWeekSelect('5')"
                         :style="{ 
                            color: !hasFifthWeek ? '#DCDCDC' : '#535353',
                            cursor: !hasFifthWeek ? 'default' : 'pointer'
                         }">5</div>
                </div>
            </div>
        </div>
        <div class="content-container">
            <div class="left-section">
                <div class="weekly-analyzed-box">
                    <div class="inner-white-box">
                        <span class="score-text" :style="{ color: getScoreColor(score) }">{{ score.toString().padStart(2, '0') }}</span>
                    </div>
                    <span class="analysis-text">이번 주 감정 분석 데이터가 없습니다.</span>
                </div>
                <div class="analysis-container">
                    <div class="analysis-row">
                        <div class="y-axis-labels">
                            <div>좋음</div>
                            <div>보통</div>
                            <div>나쁨</div>
                        </div>
                        <div class="analysis-box">
                            <div class="analysis-divider" style="top: 33.33%"></div>
                            <div class="analysis-divider" style="top: 66.66%"></div>
                            <svg :width="347" :height="231" style="position:absolute; left:0; top:0; pointer-events:none; z-index:1;">
                              <polyline
                                :points="polylinePoints"
                                fill="none"
                                stroke="#6B3E26"
                                stroke-width="1"
                              />
                              <circle
                                v-for="(x, i) in xCoords"
                                :key="i"
                                :cx="x"
                                :cy="230"
                                r="1.5"
                                fill="#000"
                              />
                            </svg>
                            <div class="chart-area">
                            </div>
                        </div>
                    </div>
                    <div class="x-axis-labels">
                        <div>일</div>
                        <div>월</div>
                        <div>화</div>
                        <div>수</div>
                        <div>목</div>
                        <div>금</div>
                        <div>토</div>
                    </div>
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
            </div>
            <div class="right-section" 
                 @mouseleave="handleSectionMouseLeave">
                <div class="weekly-card sunday" 
                     @mouseenter="handleMouseEnter('sunday')"
                     :style="{ zIndex: weeklyDiaryStore.getCardZIndex('sunday') }">
                    <div class="card-content">
                        <div class="date-label">{{ getCurrentWeekDates[0] }}</div>
                        <div class="day-label">일</div>
                        <div class="image-container">
                            <!-- 이미지가 들어갈 공간 -->
                        </div>
                        <div class="image-bottom-text" :style="{ color: getBottomTextColor(0) }">
                            00
                        </div>
                        <div class="image-bottom-desc">
                            해당 날짜의 일기가 없습니다.
                        </div>
                    </div>
                </div>
                <div class="weekly-card monday"
                     @mouseenter="handleMouseEnter('monday')"
                     :style="{ zIndex: weeklyDiaryStore.getCardZIndex('monday') }">
                    <div class="card-content">
                        <div class="date-label">{{ getCurrentWeekDates[1] }}</div>
                        <div class="day-label">월</div>
                        <div class="image-container">
                            <!-- 이미지가 들어갈 공간 -->
                        </div>
                        <div class="image-bottom-text" :style="{ color: getBottomTextColor(0) }">
                            00
                        </div>
                        <div class="image-bottom-desc">
                            해당 날짜의 일기가 없습니다.
                        </div>
                    </div>
                </div>
                <div class="weekly-card tuesday"
                     @mouseenter="handleMouseEnter('tuesday')"
                     :style="{ zIndex: weeklyDiaryStore.getCardZIndex('tuesday') }">
                    <div class="card-content">
                        <div class="date-label">{{ getCurrentWeekDates[2] }}</div>
                        <div class="day-label">화</div>
                        <div class="image-container">
                            <!-- 이미지가 들어갈 공간 -->
                        </div>
                        <div class="image-bottom-text" :style="{ color: getBottomTextColor(0) }">
                            00
                        </div>
                        <div class="image-bottom-desc">
                            해당 날짜의 일기가 없습니다.
                        </div>
                    </div>
                </div>
                <div class="weekly-card wednesday"
                     @mouseenter="handleMouseEnter('wednesday')"
                     :style="{ zIndex: weeklyDiaryStore.getCardZIndex('wednesday') }">
                    <div class="card-content">
                        <div class="date-label">{{ getCurrentWeekDates[3] }}</div>
                        <div class="day-label">수</div>
                        <div class="image-container">
                            <!-- 이미지가 들어갈 공간 -->
                        </div>
                        <div class="image-bottom-text" :style="{ color: getBottomTextColor(0) }">
                            00
                        </div>
                        <div class="image-bottom-desc">
                            해당 날짜의 일기가 없습니다.
                        </div>
                    </div>
                </div>
                <div class="weekly-card thursday"
                     @mouseenter="handleMouseEnter('thursday')"
                     :style="{ zIndex: weeklyDiaryStore.getCardZIndex('thursday') }">
                    <div class="card-content">
                        <div class="date-label">{{ getCurrentWeekDates[4] }}</div>
                        <div class="day-label">목</div>
                        <div class="image-container">
                            <!-- 이미지가 들어갈 공간 -->
                        </div>
                        <div class="image-bottom-text" :style="{ color: getBottomTextColor(0) }">
                            00
                        </div>
                        <div class="image-bottom-desc">
                            해당 날짜의 일기가 없습니다.
                        </div>
                    </div>
                </div>
                <div class="weekly-card friday"
                     @mouseenter="handleMouseEnter('friday')"
                     :style="{ zIndex: weeklyDiaryStore.getCardZIndex('friday') }">
                    <div class="card-content">
                        <div class="date-label">{{ getCurrentWeekDates[5] }}</div>
                        <div class="day-label">금</div>
                        <div class="image-container">
                            <!-- 이미지가 들어갈 공간 -->
                        </div>
                        <div class="image-bottom-text" :style="{ color: getBottomTextColor(0) }">
                            00
                        </div>
                        <div class="image-bottom-desc">
                            해당 날짜의 일기가 없습니다.
                        </div>
                    </div>
                </div>
                <div class="weekly-card saturday"
                     @mouseenter="handleMouseEnter('saturday')"
                     :style="{ zIndex: weeklyDiaryStore.getCardZIndex('saturday') }">
                    <div class="card-content">
                        <div class="date-label">{{ getCurrentWeekDates[6] }}</div>
                        <div class="day-label">토</div>
                        <div class="image-container">
                            <!-- 이미지가 들어갈 공간 -->
                        </div>
                        <div class="image-bottom-text" :style="{ color: getBottomTextColor(0) }">
                            00
                        </div>
                        <div class="image-bottom-desc">
                            해당 날짜의 일기가 없습니다.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWeeklyDiaryStore } from '../../../stores/weeklyDiaryStore';

const weeklyDiaryStore = useWeeklyDiaryStore();
const selectedDate = ref(new Date());
const selectedWeek = ref('1');
const score = ref(0);

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

const getWeekInfo = computed(() => {
    const date = new Date(selectedDate.value);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // 해당 월의 1일
    const firstDay = new Date(year, month, 1);
    // 해당 월의 마지막 날
    const lastDay = new Date(year, month + 1, 0);
    
    // 1일이 속한 주의 일요일 날짜
    const firstWeekSunday = new Date(firstDay);
    firstWeekSunday.setDate(firstDay.getDate() - firstDay.getDay());
    
    // 마지막 날이 속한 주의 일요일 날짜
    const lastWeekSunday = new Date(lastDay);
    lastWeekSunday.setDate(lastDay.getDate() - lastDay.getDay());
    
    // 전체 주 수 계산
    const totalWeeks = Math.ceil((lastWeekSunday - firstWeekSunday) / (7 * 24 * 60 * 60 * 1000)) + 1;
    
    return {
        firstWeekSunday,
        lastWeekSunday,
        totalWeeks
    };
});

const getCurrentWeekDates = computed(() => {
    const weekInfo = getWeekInfo.value;
    const selectedWeekNum = parseInt(selectedWeek.value);
    
    // 선택된 주의 시작일 (일요일)
    const weekStart = new Date(weekInfo.firstWeekSunday);
    weekStart.setDate(weekStart.getDate() + (selectedWeekNum - 1) * 7);
    
    // 선택된 주의 날짜들 계산
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        dates.push(date.getDate());
    }
    
    return dates;
});

const hasFifthWeek = computed(() => {
    return getWeekInfo.value.totalWeeks >= 5;
});

const handleWeekSelect = (week) => {
    const weekNum = parseInt(week);
    if (weekNum <= 5 && (weekNum <= getWeekInfo.value.totalWeeks)) {
        selectedWeek.value = week;
    }
};

const getScoreColor = (score) => {
    if (score >= 0 && score <= 33) return '#A60303';
    if (score >= 34 && score <= 66) return '#DA930E';
    if (score >= 67 && score <= 100) return '#346FD2';
    return '#A60303'; // 기본 색상
};

const boxWidth = 347;
const xCoords = Array.from({ length: 7 }, (_, i) => (boxWidth / 7) * (i + 0.5));
const yCoord = 230;
const polylinePoints = xCoords.map(x => `${x},${yCoord}`).join(' ');

// 이미지 하단 텍스트 색상 반환 함수
const getBottomTextColor = (value) => {
    if (value >= 0 && value <= 33) return '#A60303';
    if (value >= 34 && value <= 66) return '#DA930E';
    if (value >= 67 && value <= 100) return '#346FD2';
    return '#A60303';
};

const handleMouseEnter = (day) => {
    weeklyDiaryStore.addHoveredCard(day);
};

const handleSectionMouseLeave = () => {
    weeklyDiaryStore.resetHoveredCards();
};
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-top: 18px;
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
    align-items: center;
    margin-top: -20px;
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

.left-section {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 80px;
    margin-right: 60px;
    flex-direction: column;
}

.weekly-analyzed-box {
    width: 345px;
    height: 46px;
    background-color: #F7F2EB;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    gap: 10px;
}

.inner-white-box {
    width: 32px;
    height: 32px;
    background-color: #FFFFFF;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 7px 0;
}

.score-text {
    font-family: 'Akshar', sans-serif;
    font-weight: 500;
    font-size: 21px;
    line-height: 1;
    display: flex;
    align-items: center;
}

.analysis-text {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #535353;
    margin-left: 8px;
}

.analysis-container {
    width: 345px;
    height: 262px;
    margin-top: 20px;
}

.analysis-row {
    position: relative;
    height: 231px;
    width: 347px;
}

.y-axis-labels {
    position: absolute;
    left: -32px;
    top: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    font-family: 'Ownglyph PDH', sans-serif;
    font-weight: 400;
    font-size: 24px;
    color: #535353;
    z-index: 2;
}

.y-axis-labels div:first-child { /* 좋음 */
    position: relative;
    top: 20px;
}
.y-axis-labels div:nth-child(2) { /* 보통 */
    position: relative;
    top: 0;
}
.y-axis-labels div:last-child { /* 나쁨 */
    position: relative;
    top: -20px;
}

.analysis-box {
    width: 347px;
    height: 231px;
    background-color: #FAFAFA;
    border-radius: 0;
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 1;
}

.analysis-divider {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1.5px;
    background-color: rgba(230, 221, 221, 0.7);
    z-index: 10;
}

.chart-area {
    flex: 1;
    height: 100%;
    /* 차트나 내용이 들어갈 영역 */
}

.x-axis-labels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 347px;
    margin-top: 8px;
    font-family: 'Ownglyph PDH', sans-serif;
    font-weight: 400;
    font-size: 24px;
    color: #535353;
}
.x-axis-labels > div:first-child {
    margin-left: 18px;
}
.x-axis-labels > div:last-child {
    margin-right: 18px;
}

.my-diary-header {
    margin-top: 30px;
    width: 100%;
}

.week-navigation {
    display: flex;
    gap: 0px;
    align-items: center;
    height: 100%;
}

.week-item {
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 24px;
    color: #535353;
    cursor: pointer;
    position: relative;
    padding: 5px;
    margin-right: 30px;
}

.week-item:last-child {
    margin-right: 130px;
}

.week-item:not(:first-child):hover {
    opacity: 0.8;
}

.week-item.active::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: #FFD4D4;
    border-radius: 50%;
    z-index: -1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.week-item.disabled {
    opacity: 1;
}

.week-item.disabled:hover {
    opacity: 1;
}

.moodlog {
    width: 345px;
    margin-top: 50px;
}

.moodlog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.moodlog-header h3 {
    font-family: var(--font-akshar);
    font-weight: 200;
    font-size: 24px;
    color: #535353;
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

.moodlog-content {
    margin-top: 5px;
    position: relative;
}

.moodlog-textbox {
    width: 345px;
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

.right-section {
    flex: 1;
    margin-right: 70px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
}

.weekly-card {
    width: 258px;
    height: 639px;
    background-color: #F6F6F6;
    border: 1px solid #AEAEAE;
    border-radius: 0;
    padding: 1px;
    box-sizing: border-box;
    box-shadow: none;
    position: absolute;
    transition: all 0.3s ease;
}

.sunday {
    left: 0;
}

.monday {
    left: 90px;
}

.tuesday {
    left: 180px;
}

.wednesday {
    left: 270px;
}

.thursday {
    left: 360px;
}

.friday {
    left: 450px;
}

.saturday {
    left: 540px;
}

.date-label {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: #535353;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 2;
}

.day-label {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: #535353;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 2;
}

.image-container {
    width: 256px;
    height: 511px;
    background-color: #F6F6F6;
    margin: 0 auto;
    position: relative;
    z-index: 0;
}

.image-bottom-text {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 511px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 18px;
    border-radius: 0;
    z-index: 2;
}

.image-bottom-desc {
    height: 40px;
    min-width: 180px;
    display: flex;
    align-items: center;
    position: absolute;
    left: 50px;
    top: 511px;
    font-family: 'Ownglyph PDH', sans-serif;
    font-weight: 400;
    font-size: 18px;
    color: #B9B9B9;
    z-index: 2;
    white-space: nowrap;
}
</style>