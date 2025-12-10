<template>
  <div class="login-container">
    <div class="login-card card fade-in-up">
      <!-- 系统标题和Logo区域 -->
      <div class="login-header">
        <div class="logo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="url(#gradient)" stroke="url(#gradient)" stroke-width="2"/>
            <circle cx="12" cy="18" r="2" fill="url(#gradient)"/>
            <path d="M8 20H16" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="system-title">泵房自动化系统</h1>
        <p class="system-subtitle">Pump Room Automation System</p>
      </div>

      <!-- 登录表单 -->
      <div class="login-form">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="input-field"
              placeholder="请输入用户名"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field"
                placeholder="请输入密码"
                required
                :disabled="loading"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3L21 21M10.584 10.587C10.2319 10.9391 10.0303 11.4304 10.0303 11.9435C10.0303 12.4566 10.2319 12.9479 10.584 13.3L10.584 13.3C10.9361 13.6521 11.4274 13.8537 11.9405 13.8537C12.4536 13.8537 12.9449 13.6521 13.297 13.3M10.584 10.587L13.297 13.3M10.584 10.587L8 8.003M13.297 13.3L16 16M8 8.003C6.14903 9.85297 5.31445 12.0242 6.07 14.12C7.36952 17.7279 10.8979 20 15 20C16.9421 20 18.7514 19.4407 20.262 18.474M8 8.003L9.262 6.741C10.7726 5.77524 12.5819 5.21595 14.524 5.216C18.6261 5.216 22.1545 7.48805 23.454 11.096C23.1192 11.9735 22.7071 12.8142 22.223 13.604" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#666" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 记住我选项 -->
          <div class="form-options">
            <label class="checkbox-wrapper">
              <input
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="checkbox"
                :disabled="loading"
              />
              <span class="checkmark"></span>
              记住我
            </label>
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e74c3c" stroke-width="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="#e74c3c" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="#e74c3c" stroke-width="2"/>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            class="login-button btn"
            :disabled="loading || !isFormValid"
          >
            <svg v-if="loading" class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="60" stroke-dashoffset="60" stroke-linecap="round">
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/>
              </circle>
            </svg>
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </form>
      </div>

      <!-- 底部信息 -->
      <div class="login-footer">
        <p class="copyright">© 2024 泵房自动化系统. 保留所有权利.</p>
        <p class="version">版本 v1.0.0</p>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false
})

const isFormValid = computed(() => {
  return loginForm.value.username.trim() && loginForm.value.password.trim()
})

const handleLogin = async () => {
  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    // 调用真实的认证API
    const response = await authAPI.login(
      loginForm.value.username, 
      loginForm.value.password
    )

    // 验证用户权限 - 只允许admin账号访问大屏系统
    const username = response.user?.username || loginForm.value.username
    if (username.toLowerCase() !== 'admin') {
      // 清除已保存的认证信息
      authAPI.logout()
      errorMessage.value = '抱歉，大屏系统仅限管理员账号访问'
      return
    }

    // 保存记住我选项
    if (loginForm.value.rememberMe) {
      localStorage.setItem('rememberMe', 'true')
      localStorage.setItem('rememberedUsername', loginForm.value.username)
    } else {
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('rememberedUsername')
    }

    // 登录成功提示
    console.log('登录成功:', response.user)

    // 跳转到大屏
    router.push('/screen')
    
  } catch (error) {
    console.error('登录错误:', error)
    
    // 根据错误类型显示不同的错误信息
    if (error.message.includes('401') || error.message.includes('用户名或密码')) {
      errorMessage.value = '用户名或密码错误，请重试'
    } else if (error.message.includes('网络') || error.message.includes('fetch')) {
      errorMessage.value = '网络连接失败，请检查网络设置'
    } else if (error.message.includes('禁用')) {
      errorMessage.value = '账号已被禁用，请联系管理员'
    } else {
      errorMessage.value = error.message || '登录失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

// 检查是否有记住的登录信息
const rememberMe = localStorage.getItem('rememberMe')
const rememberedUsername = localStorage.getItem('rememberedUsername')
if (rememberMe && rememberedUsername) {
  loginForm.value.username = rememberedUsername
  loginForm.value.rememberMe = true
}

// 检查是否已经登录
if (authAPI.isAuthenticated && authAPI.isAuthenticated()) {
  router.push('/screen')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #063a72 0%, #021f3f 60%, #01142a 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  margin-bottom: 20px;
}

.system-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.system-subtitle {
  color: #666;
  font-size: 14px;
  font-weight: 400;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox:checked + .checkmark {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-color: #667eea;
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 8px;
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.copyright {
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}

.version {
  color: #999;
  font-size: 11px;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 10px;
  }
  
  .system-title {
    font-size: 24px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>

