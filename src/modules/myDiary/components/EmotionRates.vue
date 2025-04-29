<template>
    <div class="emotion-rates">
      <canvas ref="chartCanvas"></canvas>
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
  
  const chartCanvas = ref(null);
  let chartInstance = null;
  
  const totalScore = computed(() => {
    return props.positiveScore + props.neutralScore + props.negativeScore;
  });
  
  const hasData = computed(() => {
    return totalScore.value > 0;
  });
  
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
  
  watch([() => props.positiveScore, () => props.neutralScore, () => props.negativeScore], 
    () => {
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
        
        const data = [props.positiveScore, props.neutralScore, props.negativeScore];
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
  </style>