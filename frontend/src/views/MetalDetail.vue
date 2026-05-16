<template>
  <div class="metal-detail">
    <el-card v-if="metal">
      <template #header>
        <div class="card-header">
          <span>{{ metal.icon }} {{ metal.name }}</span>
          <el-button
            v-if="isLoggedIn"
            :type="isFavorite ? 'danger' : 'primary'"
            @click="toggleFavorite"
          >
            {{ isFavorite ? '取消关注' : '关注' }}
          </el-button>
        </div>
      </template>

      <div class="price-info">
        <div class="current-price">
          <span class="price-value">{{ currentPrice?.toFixed(2) || '--' }}</span>
          <span class="price-unit">{{ metal.unit }}</span>
        </div>
      </div>

      <div class="date-filter">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="fetchPrices"
        />
      </div>

      <div ref="chartRef" class="chart-container"></div>

      <div class="inquiry-section">
        <el-button type="primary" @click="showInquiry = true">发布询价单</el-button>
        <el-button type="success" @click="showIntention = true" style="margin-left: 10px">发布意向单</el-button>
      </div>
    </el-card>

    <el-dialog v-model="showInquiry" title="发布询价单" width="500px">
      <el-form :model="inquiryForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="inquiryForm.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="inquiryForm.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="inquiryForm.contact" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showInquiry = false">取消</el-button>
        <el-button type="primary" @click="submitInquiry">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showIntention" title="发布意向单" width="500px">
      <el-form :model="intentionForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="intentionForm.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="intentionForm.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="intentionForm.contact" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showIntention = false">取消</el-button>
        <el-button type="primary" @click="submitIntention">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import request from '../utils/request'

const route = useRoute()
const metal = ref(null)
const prices = ref([])
const dateRange = ref(null)
const chartRef = ref(null)
const chart = ref(null)
const showInquiry = ref(false)
const showIntention = ref(false)
const inquiryForm = ref({ title: '', content: '', contact: '' })
const intentionForm = ref({ title: '', content: '', contact: '' })

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const isFavorite = ref(false)
const currentPrice = computed(() => prices.value[prices.value.length - 1]?.price)

const fetchPrices = async () => {
  const params = {}
  if (dateRange.value) {
    params.startDate = dateRange.value[0].toISOString().split('T')[0]
    params.endDate = dateRange.value[1].toISOString().split('T')[0]
  }

  const data = await request.get(`/metals/${route.params.code}`, { params })
  metal.value = data.metal
  prices.value = data.prices
  renderChart()
  checkFavorite()
}

const renderChart = () => {
  if (!chartRef.value) return

  if (!chart.value) {
    chart.value = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: prices.value.map(p => new Date(p.fetch_time).toLocaleDateString())
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: prices.value.map(p => p.price),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
        ])
      },
      lineStyle: {
        color: '#667eea'
      },
      itemStyle: {
        color: '#667eea'
      }
    }]
  }

  chart.value.setOption(option)
}

const checkFavorite = async () => {
  if (!isLoggedIn.value) return
  try {
    const favorites = await request.get('/favorites')
    isFavorite.value = favorites.some(f => f.metal_id === metal.value.id)
  } catch (e) {}
}

const toggleFavorite = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }

  if (isFavorite.value) {
    await request.delete(`/favorites/${metal.value.id}`)
    isFavorite.value = false
    ElMessage.success('已取消关注')
  } else {
    await request.post('/favorites', { metalId: metal.value.id })
    isFavorite.value = true
    ElMessage.success('关注成功')
  }
}

const submitInquiry = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }
  await request.post('/inquiries', {
    ...inquiryForm.value,
    metalId: metal.value.id,
    type: 'inquiry'
  })
  ElMessage.success('询价单提交成功')
  showInquiry.value = false
}

const submitIntention = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }
  await request.post('/inquiries', {
    ...intentionForm.value,
    metalId: metal.value.id,
    type: 'intention'
  })
  ElMessage.success('意向单提交成功')
  showIntention.value = false
}

onMounted(() => {
  fetchPrices()
})
</script>

<style scoped>
.metal-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  text-align: center;
  padding: 30px 0;
}

.current-price .price-value {
  font-size: 48px;
  font-weight: bold;
  color: #667eea;
}

.current-price .price-unit {
  font-size: 18px;
  color: #909399;
  margin-left: 10px;
}

.date-filter {
  text-align: center;
  margin-bottom: 20px;
}

.chart-container {
  height: 400px;
  margin: 20px 0;
}

.inquiry-section {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
