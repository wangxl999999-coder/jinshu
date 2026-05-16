<template>
  <div class="home">
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索金属名称..."
        size="large"
        clearable
        @input="searchMetals"
        style="max-width: 500px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="metals-grid">
      <el-card
        v-for="metal in metals"
        :key="metal.id"
        class="metal-card"
        shadow="hover"
        @click="goToDetail(metal.code)"
      >
        <div class="metal-header">
          <span class="metal-icon">{{ metal.icon }}</span>
          <span class="metal-name">{{ metal.name }}</span>
        </div>
        <div class="metal-price">
          <span class="price-value">{{ metal.current_price?.toFixed(2) || '--' }}</span>
          <span class="price-unit">{{ metal.unit }}</span>
        </div>
        <div class="metal-change" :class="metal.price_change >= 0 ? 'up' : 'down'">
          <el-icon v-if="metal.price_change >= 0"><CaretTop /></el-icon>
          <el-icon v-else><CaretBottom /></el-icon>
          <span>{{ metal.price_change?.toFixed(2) || '0.00' }}</span>
          <span>({{ metal.change_percent?.toFixed(2) || '0.00' }}%)</span>
        </div>
        <div class="update-time">
          更新于: {{ metal.fetch_time ? formatTime(metal.fetch_time) : '--' }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, CaretTop, CaretBottom } from '@element-plus/icons-vue'
import request from '../utils/request'

const router = useRouter()
const searchKeyword = ref('')
const metals = ref([])

const searchMetals = async () => {
  const data = await request.get('/metals', { params: { search: searchKeyword.value } })
  metals.value = data
}

const goToDetail = (code) => {
  router.push(`/metal/${code}`)
}

const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

onMounted(() => {
  searchMetals()
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.search-section {
  text-align: center;
  margin-bottom: 30px;
}

.metals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.metal-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.metal-card:hover {
  transform: translateY(-5px);
}

.metal-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.metal-icon {
  font-size: 32px;
  margin-right: 10px;
}

.metal-name {
  font-size: 20px;
  font-weight: bold;
}

.metal-price {
  margin-bottom: 10px;
}

.price-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.price-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 5px;
}

.metal-change {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.metal-change.up {
  color: #67c23a;
}

.metal-change.down {
  color: #f56c6c;
}

.update-time {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 10px;
}
</style>
