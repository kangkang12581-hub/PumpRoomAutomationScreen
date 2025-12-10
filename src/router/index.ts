import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import apiService from '../services/api'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录 - 泵房自动化系统'
    }
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('../views/Screen.vue'),
    meta: {
      title: '数据大屏 - 泵房自动化系统',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!apiService.isAuthenticated()) {
      // 清除可能存在的无效token
      apiService.clearAuth()
      next('/login')
      return
    }
    
    // 验证是否为admin账号 - 大屏系统仅限管理员访问
    const currentUser = apiService.getCurrentUser()
    const username = currentUser?.username || ''
    if (username.toLowerCase() !== 'admin') {
      console.warn('非管理员账号尝试访问大屏系统:', username)
      // 清除认证信息并跳转到登录页
      apiService.clearAuth()
      next('/login')
      return
    }
  }
  
  // 如果已登录用户访问登录页，检查是否为admin
  if (to.path === '/login' && apiService.isAuthenticated()) {
    const currentUser = apiService.getCurrentUser()
    const username = currentUser?.username || ''
    // 只有admin账号才能自动跳转到大屏
    if (username.toLowerCase() === 'admin') {
      next('/screen')
      return
    } else {
      // 非admin账号需要重新登录
      apiService.clearAuth()
    }
  }
  
  next()
})

export default router

