<template>
  <div class="emotion-bar-chart">
    <h4>이번 달 나의 감정</h4>
    <div class="bar-bg">
      <canvas ref="barChart" width="183" height="110"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const props = defineProps({
  diaryData: {
    type: Array,
    required: true
  }
});

const barChart = ref(null);
let chart = null;

const processEmotionData = (data) => {
  const emotionCounts = {};
  
  data.forEach(diary => {
    [diary.emotionSummary1, diary.emotionSummary2, diary.emotionSummary3].forEach(emotion => {
      if (emotion) {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
    });
  });

  return Object.entries(emotionCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
};

const createChart = (emotionData) => {
  if (chart) chart.destroy();
  chart = new Chart(barChart.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: emotionData.map(e => e.label),
      datasets: [{
        data: emotionData.map(e => e.count),
        backgroundColor: ['#F77C7C', '#FFE082', '#90CAF9'],
        barThickness: 15
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      layout: { padding: { top: 10 } },
      plugins: {
        legend: { display: false },
        datalabels: {
          enabled: true,
          anchor: 'end',
          align: 'end',
          offset: -2,
          color: '#222',
          font: {
            family: 'Inter',
            weight: '600',
            size: 12
          },
          formatter: (value) => value
        }
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            display: true,
            font: { family: 'Inter', size: 12, weight: '400' },
            color: '#222',
            padding: 6
          },
          border: { display: false },
          categoryPercentage: 0.95
        },
        y: {
          beginAtZero: true,
          max: Math.max(...emotionData.map(e => e.count)) + 1,
          grid: { display: false, drawBorder: false },
          ticks: { display: false },
          border: { display: false }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
};

watch(() => props.diaryData, (newData) => {
  if (newData && newData.length > 0) {
    const topEmotions = processEmotionData(newData);
    createChart(topEmotions);
  }
}, { immediate: true });

onMounted(() => {
  if (props.diaryData && props.diaryData.length > 0) {
    const topEmotions = processEmotionData(props.diaryData);
    createChart(topEmotions);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.emotion-bar-chart {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.emotion-bar-chart h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  margin-left: 30px;
  color: #222;
  text-align: left;
  width: 100%;
}
.bar-bg {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 0 0 0 0;
  width: 183px;
  height: 160px;
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
}
</style>