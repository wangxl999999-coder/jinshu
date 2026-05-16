<template>
  <div class="admin-page">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="用户管理" name="users">
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" width="100">
            <template #default="{ row }">
              <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
                {{ row.role === 'admin' ? '管理员' : '普通用户' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="注册时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" v-if="isAdmin">
            <template #default="{ row }">
              <el-button
                type="danger"
                size="small"
                @click="deleteUser(row.id)"
                :disabled="row.role === 'admin'"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="客服会话" name="sessions">
        <el-table :data="sessions" style="width: 100%">
          <el-table-column prop="session_code" label="会话编号" />
          <el-table-column prop="username" label="用户" />
          <el-table-column label="有效线索" width="120">
            <template #default="{ row }">
              <el-switch
                v-model="row.is_valid_lead"
                :active-value="1"
                :inactive-value="0"
                @change="toggleLead(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="viewChat(row.session_code)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="询价单管理" name="inquiries">
        <el-table :data="adminInquiries" style="width: 100%">
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === 'inquiry' ? 'primary' : 'success'">
                {{ row.type === 'inquiry' ? '询价单' : '意向单' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户" width="120" />
          <el-table-column prop="metal_name" label="金属" width="120" />
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="content" label="内容" show-overflow-tooltip />
          <el-table-column prop="contact" label="联系方式" width="150" />
          <el-table-column prop="created_at" label="时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.created_at) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="发布新闻" name="news">
        <el-card>
          <el-form :model="newsForm" label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="newsForm.title" />
            </el-form-item>
            <el-form-item label="来源">
              <el-input v-model="newsForm.source" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="newsForm.content" type="textarea" :rows="10" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="publishNews">发布新闻</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showChatDialog" title="查看会话" width="600px">
      <div class="chat-messages">
        <div
          v-for="(msg, index) in chatMessages"
          :key="index"
          :class="['message', msg.sender_type === 'user' ? 'user-message' : 'admin-message']"
        >
          <div class="message-content">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.created_at) }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const activeTab = ref('users')
const users = ref([])
const sessions = ref([])
const adminInquiries = ref([])
const newsForm = ref({ title: '', source: '', content: '' })
const showChatDialog = ref(false)
const chatMessages = ref([])

const isAdmin = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role === 'admin'
})

const fetchUsers = async () => {
  const data = await request.get('/admin/users')
  users.value = data
}

const fetchSessions = async () => {
  const data = await request.get('/admin/sessions')
  sessions.value = data
}

const fetchInquiries = async () => {
  const data = await request.get('/admin/inquiries')
  adminInquiries.value = data
}

const deleteUser = async (id) => {
  await request.delete(`/admin/users/${id}`)
  ElMessage.success('删除成功')
  fetchUsers()
}

const toggleLead = async (row) => {
  await request.put(`/admin/sessions/${row.id}/lead`, {
    is_valid_lead: row.is_valid_lead
  })
  ElMessage.success('更新成功')
}

const viewChat = async (sessionCode) => {
  const data = await request.get(`/chat/session/${sessionCode}/messages`)
  chatMessages.value = data
  showChatDialog.value = true
}

const publishNews = async () => {
  await request.post('/admin/news', newsForm.value)
  ElMessage.success('发布成功')
  newsForm.value = { title: '', source: '', content: '' }
}

const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

onMounted(() => {
  fetchUsers()
  fetchSessions()
  fetchInquiries()
})
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.chat-messages {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background: #f5f7fa;
}

.message {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.user-message {
  align-items: flex-end;
}

.admin-message {
  align-items: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 10px;
}

.user-message .message-content {
  background: #409eff;
  color: white;
}

.admin-message .message-content {
  background: white;
  border: 1px solid #e4e7ed;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>
