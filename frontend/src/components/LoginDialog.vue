<template>
  <el-dialog v-model="visible" title="用户登录" width="400px">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="登录" name="login">
        <el-form ref="loginFormRef" :model="loginForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.username" placeholder="请输入用户名或邮箱" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form ref="registerFormRef" :model="registerForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="registerForm.email" type="email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister" style="width: 100%">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible', 'success'])

const activeTab = ref('login')
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '' })

const visible = ref(props.visible)

const handleLogin = async () => {
  try {
    const data = await request.post('/auth/login', loginForm.value)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    ElMessage.success('登录成功')
    emit('success', data.user)
    emit('update:visible', false)
  } catch (error) {
    console.error(error)
  }
}

const handleRegister = async () => {
  try {
    const data = await request.post('/auth/register', registerForm.value)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    ElMessage.success('注册成功')
    emit('success', data.user)
    emit('update:visible', false)
  } catch (error) {
    console.error(error)
  }
}
</script>
