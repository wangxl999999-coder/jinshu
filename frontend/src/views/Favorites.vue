<template>
  <div class="favorites-page">
    <h1 class="page-title">我的关注</h1>
    <el-table :data="favorites" style="width: 100%">
      <el-table-column prop="name" label="金属名称" />
      <el-table-column prop="current_price" label="当前价格" />
      <el-table-column label="价格阈值">
        <template #default="{ row }">
          <el-input-number
            v-model="row.threshold"
            @change="updateThreshold(row)"
            style="width: 150px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="removeFavorite(row.metal_id)">
            取消关注
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="favorites.length === 0" description="暂无关注的金属" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const favorites = ref([])

const fetchFavorites = async () => {
  const data = await request.get('/favorites')
  favorites.value = data
}

const updateThreshold = async (row) => {
  await request.post('/favorites', {
    metalId: row.metal_id,
    threshold: row.threshold
  })
  ElMessage.success('阈值更新成功')
}

const removeFavorite = async (metalId) => {
  await request.delete(`/favorites/${metalId}`)
  favorites.value = favorites.value.filter(f => f.metal_id !== metalId)
  ElMessage.success('已取消关注')
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.favorites-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 20px;
}
</style>
