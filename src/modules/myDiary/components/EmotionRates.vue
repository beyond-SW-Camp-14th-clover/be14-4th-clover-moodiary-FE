<template>
    <div class="emotion-rates">
      <canvas ref="chartCanvas"></canvas>
      <!-- 테스트 버튼 추가 -->
      <div class="test-controls" v-if="showTestControls">
        <button @click="loadTestData">테스트 데이터 로드</button>
        <button @click="resetData">초기화</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  
  const props = defineProps({
    positiveScore: {
      type: Number,
      default: 0
    },
    neutralScore: {
      type: Number,
      default: 0
    },
    negativeScore: {
      type: Number,
      default: 0
    }
  });
  
  // 내부 상태 추가 (테스트용)
  const internalPositive = ref(props.positiveScore);
  const internalNeutral = ref(props.neutralScore);
  const internalNegative = ref(props.negativeScore);
  const showTestControls = ref(true);
  
  const chartCanvas = ref(null);
  let chartInstance = null;
  
  const totalScore = computed(() => {
    return internalPositive.value + internalNeutral.value + internalNegative.value;
  });
  
  const hasData = computed(() => {
    return totalScore.value > 0;
  });
  

  const loadTestData = () => {
    internalPositive.value = 45;
    internalNeutral.value = 33;
    internalNegative.value = 22;
    drawChart();
  };
  

  const resetData = () => {
    internalPositive.value = 0;
    internalNeutral.value = 0;
    internalNegative.value = 0;
    drawChart();
  };
  
  onMounted(() => {

    const loadChartJs = () => {
      return new Promise((resolve) => {
        if (window.Chart) {
          resolve(window.Chart);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1';
        script.onload = () => {
          const dataLabelsScript = document.createElement('script');
          dataLabelsScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.1.0';
          dataLabelsScript.onload = () => {
            if (window.Chart && window.ChartDataLabels) {
              window.Chart.register(window.ChartDataLabels);
              resolve(window.Chart);
            }
          };
          document.head.appendChild(dataLabelsScript);
        };
        document.head.appendChild(script);
      });
    };
  
    loadChartJs().then(() => {
      drawChart();
    });
  });
  
  // props 값 변경 시 내부 상태 업데이트
  watch([() => props.positiveScore, () => props.neutralScore, () => props.negativeScore], 
    ([newPositive, newNeutral, newNegative]) => {
      internalPositive.value = newPositive;
      internalNeutral.value = newNeutral; 
      internalNegative.value = newNegative;
      if (chartInstance) {
        drawChart();
      }
    }
  );
  
  const drawChart = () => {
      if (!window.Chart) return;
      
      if (chartInstance) {
          chartInstance.destroy();
        }
        
        const ctx = chartCanvas.value.getContext('2d');
        
        if (!hasData.value) {
            // 데이터가 없는 경우 회색 원만 표시
            chartInstance = new window.Chart(ctx, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#F8F8F8'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        datalabels: { display: false }
                    }
                }
            });
            return;
        }
        
        // 데이터가 있는 경우
        const data = [internalPositive.value, internalNeutral.value, internalNegative.value];
        const colors = ['#C3E3FF', '#BBE7AD', '#FFB3B3'];
        const labels = ['긍정', '보통', '부정'];
        
        chartInstance = new window.Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    datalabels: {
                        color: '#333',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 8,
                            weight: 'normal'
                        },
                        formatter: (value) => {
                            const percent = Math.round((value / totalScore.value) * 100 * 10) / 10;
                            const index = data.indexOf(value);
                            return `${labels[index]}\n${percent.toFixed(1)}%`;
                        },
                        display: true,
                        align: 'center',
                        anchor: 'center'
                    }
                }
            }
        });
    };
    </script>
  
  <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');

  .emotion-rates {
    width: 150px;
    height: 150px;
    margin-top: 30px;
    margin-left: 0;
    position: relative;
  }
  
  .test-controls {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .test-controls button {
    padding: 5px 10px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .test-controls button:hover {
    background-color: #e0e0e0;
  }

  </style>