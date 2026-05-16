<template>
  <el-container class="app-container">
    <el-header class="header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">⚙️</span>
          <span class="logo-text">金属价格系统</span>
        </div>
        <div class="nav-menu">
          <el-menu :default-active="$route.path" mode="horizontal" @select="handleMenuSelect">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/news">金属新闻</el-menu-item>
            <el-menu-item index="/inquiry" v-if="isLoggedIn">我的询价</el-menu-item>
            <el-menu-item index="/admin" v-if="isAdmin">管理后台</el-menu-item>
          </el-menu>
        </div>
        <div class="user-area">
          <el-button v-if="!isLoggedIn" type="primary" @click="showLogin = true">登录</el-button>
          <el-dropdown v-else @command="handleCommand">
            <span class="user-name">{{ user?.username }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="favorites">我的关注</el-dropdown-item>
                <el-dropdown-item command="chat">在线客服</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main class="main-content">
      <router-view />
    </el-main>
    <el-footer class="footer">
      <p>© 2024 金属价格查看系统 - 版权所有</p>
    </el-footer>
  </el-container>

  <LoginDialog v-model:visible="showLogin" @success="onLoginSuccess" />
  <CustomerService v-model:visible="showChat" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginDialog from './components/LoginDialog.vue'
import CustomerService from './components/CustomerService.vue'

const router = useRouter()
const showLogin = ref(false)
const showChat = ref(false)
const user = ref(null)

const isLoggedIn = computed(() => !!user.value)
const isAdmin = computed(() => user.value?.role === 'admin')

const handleMenuSelect = (index) => {
  router.push(index)
}

const handleCommand = (command) => {
  if (command === 'favorites') {
    router.push('/favorites')
  } else if (command === 'chat') {
    showChat.value = true
  } else if (command === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null
    router.push('/')
  }
}

const onLoginSuccess = (userData) => {
  user.value = userData
  showLogin.value = false
}

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  height: 60px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 40px;
}

.logo-icon {
  font-size: 24px;
  margin-right: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
}

.nav-menu {
  flex: 1;
}

.nav-menu :deep(.el-menu) {
  background: transparent;
  border: none;
}

.nav-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.9);
}

.nav-menu :deep(.el-menu-item:hover),
.nav-menu :deep(.el-menu-item.is-active) {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.user-area {
  display: flex;
  align-items: center;
}

.user-name {
  cursor: pointer;
  padding: 8px 16px;
}

.main-content {
  background: #f5f7fa;
  padding: 20px;
}

.footer {
  background: #303133;
  color: #909399;
  text-align: center;
  padding: 20px;
}
</style>
