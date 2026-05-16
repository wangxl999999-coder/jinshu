<template>
  <div class="inquiry-page">
    <h1 class="page-title">我的询价单</h1>
    <el-table :data="inquiries" style="width: 100%">
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'inquiry' ? 'primary' : 'success'">
            {{ row.type === 'inquiry' ? '询价单' : '意向单' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="metal_name" label="金属" width="120" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="contact" label="联系方式" width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag>{{ row.status === 'pending' ? '待处理' : '已处理' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="inquiries.length === 0" description="暂无询价单" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const inquiries = ref([])

const fetchInquiries = async () => {
  const data = await request.get('/inquiries')
  inquiries.value = data
}

const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

onMounted(() => {
  fetchInquiries()
})
</script>

<style scoped>
.inquiry-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 20px;
}
</style>
