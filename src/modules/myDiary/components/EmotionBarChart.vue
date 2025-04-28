<template>
  <div class="emotion-bar-chart">
    <h4>이번 주 나의 감정</h4>
    <div class="bar-bg">
      <canvas ref="barChart" width="183" height="110"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const dummyEmotions = [
  { label: '슬픔', count: 8 },
  { label: '행복', count: 5 },
  { label: '지침', count: 2 }
];

const barChart = ref(null);
let chart = null;

const top3 = [...dummyEmotions]
  .sort((a, b) => b.count - a.count)
  .slice(0, 3);

const createChart = () => {
  if (chart) chart.destroy();
  chart = new Chart(barChart.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: top3.map(e => e.label),
      datasets: [{
        data: top3.map(e => e.count),
        backgroundColor: ['#F77C7C', '#FFE082', '#90CAF9'],
        barThickness: 18
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
          border: { display: false }
        },
        y: {
          beginAtZero: true,
          max: 9,
          grid: { display: false, drawBorder: false },
          ticks: { display: false },
          border: { display: false }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
};

onMounted(createChart);
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