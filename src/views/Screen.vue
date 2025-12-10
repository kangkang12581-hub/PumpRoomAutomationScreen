<template>
  <div id="screen" :style="screenScaleStyle">
    <header class="screen-header">
      <div class="time-user">
        <span>{{ now }}</span>
        <span class="user">{{ currentUser }}</span>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
      <h1>泵房冲洗沟渠自动化打捞装置</h1>
      <div class="tabs">
        <label><input type="radio" checked /> 总览-机内视频</label>
        <label><input type="radio" /> 总览-全局视频</label>
        <label><input type="radio" /> 总览-数据</label>
      </div>
    </header>

    <main class="screen-body">
      <section class="grid">
        <PumpCard v-for="i in 12" :key="i" :title="stations[i-1]" />
      </section>
      <aside class="sidebar">
        <PowerTable :rows="powerRows" />
        <DailyWeight :data="weightData" class="mt16" />
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PumpCard from '../components/PumpCard.vue'
import PowerTable from '../components/PowerTable.vue'
import DailyWeight from '../components/DailyWeight.vue'
import { authAPI, apiService } from '../services/api'

const router = useRouter()

const designWidth = 1920
const designHeight = 1080
const scale = ref(1)

const screenScaleStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  width: designWidth + 'px',
  height: designHeight + 'px'
}))

function updateScale() {
  const sw = window.innerWidth / designWidth
  const sh = window.innerHeight / designHeight
  scale.value = Math.min(sw, sh)
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})
onUnmounted(() => window.removeEventListener('resize', updateScale))

// 当前用户
const currentUser = computed(() => {
  const user = apiService.getCurrentUser()
  return user?.username || 'admin'
})

// 退出登录
const handleLogout = async () => {
  try {
    await authAPI.logout()
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    router.push('/login')
  }
}

const now = ref('')
let timer: number | undefined
onMounted(() => {
  const fmt = () => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    now.value = `${yyyy}/${mm}/${dd}  ${hh}:${mi}`
  }
  fmt()
  timer = window.setInterval(fmt, 1000 * 30)
})
onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

const stations = Array.from({ length: 12 }, (_, i) => `PX${Math.floor(i/3)+1}-${(i%3)+11}`)

const powerRows = ref(
  Array.from({ length: 12 }, (_, i) => ({
    site: `PX${i + 1}_61`,
    power: (Math.random() * 1).toFixed(2) + 'kW'
  }))
)

const weightData = ref(
  Array.from({ length: 12 }, (_, i) => ({ name: `PX${i + 1}_61`, value: Math.random() * 20 }))
)

// mock 自动刷新
onMounted(() => {
  const refresh = () => {
    powerRows.value = powerRows.value.map(r => ({ ...r, power: (Math.random() * 1).toFixed(2) + 'kW' }))
    weightData.value = weightData.value.map(w => ({ ...w, value: Math.random() * 20 }))
  }
  const id = window.setInterval(refresh, 5000)
  onUnmounted(() => window.clearInterval(id))
})
</script>

<style scoped>
#screen {
  transform-origin: left top;
  background: radial-gradient(ellipse at center, #063a72 0%, #021f3f 60%, #01142a 100%);
  color: #e6f7ff;
  overflow: hidden;
}
.screen-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 80px;
}
.screen-header h1 {
  text-align: center;
  font-size: 28px;
  letter-spacing: 2px;
}
.time-user { 
  padding-left: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.time-user .user { 
  opacity: 0.8;
}
.logout-btn {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #e6f7ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}
.tabs { 
  justify-self: end; 
  padding-right: 16px; 
  display: flex; 
  gap: 12px; 
  font-size: 12px;
}

.screen-body {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 12px;
  height: calc(100% - 80px);
  padding: 12px;
  box-sizing: border-box;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 12px;
}

.sidebar { display: flex; flex-direction: column; }
.mt16 { margin-top: 16px; }
</style>

