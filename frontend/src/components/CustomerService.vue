<template>
  <el-dialog v-model="visible" title="在线客服" width="600px" @close="handleClose">
    <div class="chat-container">
      <div class="messages" ref="messagesRef">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.senderType === 'user' ? 'user-message' : 'admin-message']"
        >
          <div class="message-content">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
        </div>
      </div>
      <div class="input-area">
        <el-input
          v-model="inputMessage"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        >
          <template #append>
            <el-button @click="sendMessage" type="primary">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { io } from 'socket.io-client'
import request from '../utils/request'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)
const messages = ref([])
const inputMessage = ref('')
const sessionCode = ref('')
const socket = ref(null)
const messagesRef = ref(null)

const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  socket.value.emit('send_message', {
    sessionCode: sessionCode.value,
    senderType: 'user',
    content: inputMessage.value
  })

  messages.value.push({
    senderType: 'user',
    content: inputMessage.value,
    createdAt: new Date()
  })

  request.post(`/chat/session/${sessionCode.value}/messages`, {
    senderType: 'user',
    content: inputMessage.value
  })

  inputMessage.value = ''
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

const handleClose = () => {
  emit('update:visible', false)
}

const initChat = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const data = await request.post('/chat/session', { userId: user.id })
  sessionCode.value = data.sessionCode

  socket.value = io('http://localhost:3000')
  socket.value.emit('join_session', sessionCode.value)

  socket.value.on('new_message', (msg) => {
    messages.value.push(msg)
    scrollToBottom()
  })

  const history = await request.get(`/chat/session/${sessionCode.value}/messages`)
  messages.value = history

  if (messages.value.length === 0) {
    messages.value.push({
      senderType: 'admin',
      content: '您好！欢迎咨询金属价格相关问题，请问有什么可以帮您？',
      createdAt: new Date()
    })
  }

  scrollToBottom()
}

onMounted(() => {
  if (visible.value) {
    initChat()
  }
})
</script>

<style scoped>
.chat-container {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
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

.input-area {
  padding: 10px 0;
}
</style>
