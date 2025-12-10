<template>
  <div class="card" ref="wrap">
    <div class="card-title">日打捞重量</div>
    <div class="card-body" ref="chartEl" style="height: 360px;"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{ data: { name: string; value: number }[] }>();
const chartEl = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function render() {
  if (!chartEl.value) return;
  if (!chart) chart = echarts.init(chartEl.value);
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        roseType: false,
        itemStyle: { borderColor: '#0b1d36', borderWidth: 2 },
        label: { color: '#91d5ff' },
        data: props.data
      }
    ]
  };
  chart.setOption(option);
}

onMounted(() => {
  render();
  const resize = () => chart?.resize();
  window.addEventListener('resize', resize);
  onUnmounted(() => window.removeEventListener('resize', resize));
});

watch(() => props.data, () => render(), { deep: true });
</script>

<style scoped>
</style>


