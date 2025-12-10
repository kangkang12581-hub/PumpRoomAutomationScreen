<template>
  <div class="card">
    <div class="card-title">格栅电机消耗功率</div>
    <div class="card-body table">
      <div class="thead">
        <span>站点</span>
        <span class="right">功率</span>
      </div>
      <div class="rows">
        <div class="row" v-for="(r, i) in rows" :key="i">
          <span>{{ r.site }}</span>
          <span class="right">{{ r.power }}</span>
        </div>
        <div class="row total">
          <span>合计</span>
          <span class="right">--</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ rows: { site: string; power: string }[] }>();
</script>

<style scoped>
.table { display: flex; flex-direction: column; max-height: 520px; }
.thead, .row { display: grid; grid-template-columns: 1fr auto; padding: 6px 4px; }
.thead { border-bottom: 1px solid rgba(22,119,255,.25); opacity: .75; }
.rows { overflow: auto; }
.row { border-bottom: 1px dashed rgba(22,119,255,.15); font-size: 12px; }
.row.total { font-weight: bold; }
.right { justify-self: end; }
</style>


