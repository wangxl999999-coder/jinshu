<template>
  <el-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="用户登录" width="400px">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="登录" name="login">
        <el-form ref="loginFormRef" :model="loginForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.username" placeholder="请输入用户名或邮箱" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.enter="handleLogin" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">登录</el-button>
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
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" @keyup.enter="handleRegister" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister" :loading="loading" style="width: 100%">注册</el-button>
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

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'success'])

const activeTab = ref('login')
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '' })
const loading = ref(false)

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }

  loading.value = true
  try {
    const data = await request.post('/auth/login', loginForm.value)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    ElMessage.success('登录成功')
    emit('success', data.user)
    emit('update:modelValue', false)
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    ElMessage.warning('请填写所有字段')
    return
  }

  loading.value = true
  try {
    const data = await request.post('/auth/register', registerForm.value)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    ElMessage.success('注册成功')
    emit('success', data.user)
    emit('update:modelValue', false)
  } catch (error) {
    console.error('注册错误:', error)
    ElMessage.error('注册失败，用户名或邮箱可能已存在')
  } finally {
    loading.value = false
  }
}
</script>
