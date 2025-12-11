/**
 * API服务模块
 * API service module for frontend HTTP requests
 */

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'  // .NET后端服务

/**
 * HTTP请求工具类
 */
class ApiService {
  baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  /**
   * 获取认证头
   */
  getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    }
  }

  /**
   * 发送HTTP请求
   */
  async request(url: string, options: any = {}) {
    // 处理查询参数
    let finalUrl = url
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString()
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      delete options.params
    }

    const config = {
      headers: this.getAuthHeaders(),
      ...options
    }

    try {
      const response = await fetch(`${this.baseURL}${finalUrl}`, config)
      
      // 检查响应状态
      if (!response.ok) {
        if (response.status === 401) {
          // 未授权，清除本地token并跳转到登录页
          this.clearAuth()
          window.location.href = '/login'
          throw new Error('登录已过期，请重新登录')
        }
        
        // 尝试解析错误响应
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: `HTTP ${response.status} ${response.statusText}` }
        }
        
        // 构建详细的错误消息
        let errorMessage = errorData.detail || errorData.message || '请求失败'
        
        console.error('API错误详情:', errorData)
        throw new Error(errorMessage)
      }

      // 解析JSON响应
      const data = await response.json()
      return data
      
    } catch (error) {
      console.error('API请求错误:', error)
      throw error
    }
  }

  /**
   * GET请求
   */
  async get(url: string, options: any = {}) {
    return this.request(url, { method: 'GET', ...options })
  }

  /**
   * POST请求
   */
  async post(url: string, data: any) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * 清除认证信息
   */
  clearAuth() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('userInfo')
  }

  /**
   * 保存认证信息
   */
  saveAuth(token: string, userInfo: any) {
    localStorage.setItem('authToken', token)
    localStorage.setItem('username', userInfo.username)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }

  /**
   * 检查是否已登录
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser() {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  }
}

// 创建API服务实例
const apiService = new ApiService()

/**
 * 认证API
 */
export const authAPI = {
  /**
   * 用户登录
   */
  async login(username: string, password: string) {
    const response = await apiService.post('/auth/login', {
      username,
      password
    })
    
    // 后端返回格式: { success: true, message: "...", data: { accessToken, user, ... } }
    const loginData = response.data || response
    
    // 保存认证信息
    apiService.saveAuth(loginData.accessToken, loginData.user)
    
    return loginData
  },

  /**
   * 用户登出
   */
  async logout() {
    try {
      await apiService.post('/auth/logout', {})
    } catch (error) {
      console.warn('登出请求失败:', error)
    } finally {
      // 无论服务器响应如何，都清除本地认证信息
      apiService.clearAuth()
    }
  },

  /**
   * 检查是否已认证
   */
  isAuthenticated: () => apiService.isAuthenticated()
}

/**
 * OPC UA数据API
 */
export const opcuaAPI = {
  /**
   * 获取所有PLC数据
   */
  async getAllPlcData() {
    const response = await apiService.get('/plcdata')
    return response?.data || response || {}
  },

  /**
   * 获取环境数据（温度、湿度）
   */
  async getEnvironmentData() {
    try {
      const response = await apiService.get('/plcdata/environment')
      return response.data || response
    } catch (error) {
      console.warn('OPC UA API不可用，使用模拟数据:', error)
      // 返回模拟数据
      return {
        actIntTemp: 24.5,
        actIntRH: 65,
        actExtTemp: 18.2,
        actExtRH: 72
      }
    }
  }
}

/**
 * 站点管理API
 */
export const siteAPI = {
  /**
   * 获取所有站点
   */
  async getAllSites() {
    const response = await apiService.get('/sites')
    return response.data || response
  },

  /**
   * 获取已启用的站点
   */
  async getEnabledSites() {
    const response = await apiService.get('/sites/enabled')
    return response.data || response
  }
}

// 导出API服务实例
export { apiService }
export default apiService


