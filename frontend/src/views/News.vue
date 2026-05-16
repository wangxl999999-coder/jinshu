<template>
  <div class="news-page">
    <h1 class="page-title">金属新闻</h1>
    <el-card v-for="item in news" :key="item.id" class="news-card" shadow="hover">
      <h3 class="news-title">{{ item.title }}</h3>
      <p class="news-content">{{ item.content }}</p>
      <div class="news-footer">
        <span class="news-source">{{ item.source || '匿名来源' }}</span>
        <span class="news-time">{{ formatTime(item.publish_time) }}</span>
      </div>
    </el-card>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="fetchNews"
      style="margin-top: 30px; text-align: center"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const news = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchNews = async () => {
  const data = await request.get('/news', {
    params: { page: currentPage.value, limit: pageSize.value }
  })
  news.value = data.news
  total.value = data.total
}

const formatTime = (time) => {
  return new Date(time).toLocaleDateString()
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.news-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
}

.news-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.news-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #303133;
}

.news-content {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 15px;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}
</style>
