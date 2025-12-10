<template>
  <div class="card pump-card">
    <div class="card-title">{{ title }}</div>
    <div class="card-body">
      <div class="content">
        <img class="machine" src="/machine.jpg" alt="machine" />
        <div class="stats">
          <div class="row">
            <span>架间温度:</span><b>0.0 ℃</b>
            <span>柜内湿度:</span><b>0 %RH</b>
          </div>
          <div class="row">
            <span>实时速度:</span><b>0.0 m/min</b>
            <span>电流:</span><b>0.0 A</b>
          </div>
          <div class="row">
            <span>速度设定:</span><b>0.0 m/min</b>
            <span>上游液位:</span><b>0.0 m</b>
          </div>
          <div class="row">
            <span>水温:</span><b>0 ℃</b>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>实时重量: <b>0.0 kg</b></span>
        <span>当前累计: <b>0.0 kg</b></span>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<style scoped>
.pump-card { display: flex; flex-direction: column; }
.content { display: grid; grid-template-columns: 140px 1fr; gap: 8px; }
.machine { width: 120px; height: auto; object-fit: contain; filter: drop-shadow(0 0 6px rgba(0, 191, 255, 0.3)); }
.stats { display: grid; gap: 4px; font-size: 12px; opacity: 0.95; }
.row { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 6px; }
.row b { color: #91d5ff; }
.footer { display: flex; justify-content: space-between; margin-top: 6px; font-size: 12px; }
.footer b { color: #ffd666; }
</style>


