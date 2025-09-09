<template>
  <div class="key-metrics-cockpit p-6 bg-gray-900 text-white min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-purple-400">关键指标驾驶舱</h2>

    <div v-if="stockInfo" class="space-y-6">
      <!-- 基础信息 -->
      <div class="bg-gray-800 p-4 rounded-lg border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-purple-400">基础信息</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-400">代码</div>
            <div class="text-lg font-bold text-blue-300">{{ stockInfo.code }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">名称</div>
            <div class="text-lg font-bold text-blue-300">{{ stockInfo.name }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">现价</div>
            <div class="text-lg font-bold text-yellow-400">¥{{ stockInfo.currentPrice }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">涨跌</div>
            <div class="text-lg font-bold" :class="stockInfo.change >= 0 ? 'text-red-400' : 'text-green-400'">
              {{ stockInfo.change >= 0 ? '+' : '' }}{{ stockInfo.change }}
              ({{ stockInfo.changePercent }}%)
            </div>
          </div>
        </div>
      </div>

      <!-- 估值指标 -->
      <div class="bg-gray-800 p-4 rounded-lg border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-cyan-400">估值指标</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-400">市盈率(TTM)</div>
            <div class="text-xl font-bold text-cyan-400">{{ stockInfo.pe?.toFixed(2) || 'N/A' }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">市净率</div>
            <div class="text-xl font-bold text-cyan-400">{{ stockInfo.pb?.toFixed(2) || 'N/A' }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">每股收益</div>
            <div class="text-xl font-bold text-cyan-400">¥{{ stockInfo.roe?.toFixed(2) || 'N/A' }}</div>
          </div>
        </div>
      </div>

      <!-- 机构利润预测指标 -->
      <div v-if="showForecastData" class="bg-gray-800 p-4 rounded-lg border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-purple-400">机构预测指标</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-400">机构共识度</div>
            <div class="text-xl font-bold text-purple-400">{{ consensusLevel }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">预期增长率</div>
            <div class="text-xl font-bold text-green-400">{{ expectedGrowthRate }}%</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">预测离散度</div>
            <div class="text-xl font-bold text-yellow-400">{{ forecastDispersion }}</div>
          </div>
        </div>
        <div class="mt-3 text-xs text-gray-300">
          基于 {{ forecastYears }} 年预测数据，平均 {{ averageInstitutions }} 家机构覆盖
        </div>
      </div>

      <!-- 预期合理性分析 -->
      <div class="bg-gray-800 p-4 rounded-lg border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-green-400">市场预期分析</h3>
        <div class="space-y-3">
          <p class="text-sm text-gray-200">
            基于当前 PE: {{ stockInfo.pe?.toFixed(2) }}，市场对该股票的预期
            <span v-if="stockInfo.pe && stockInfo.pe > 25" class="text-red-400 font-semibold">偏高</span>
            <span v-else-if="stockInfo.pe && stockInfo.pe > 15" class="text-yellow-400 font-semibold">适中</span>
            <span v-else class="text-green-400 font-semibold">保守</span>
          </p>

          <div class="text-sm text-gray-300">
            <p><strong>增长质量评估：</strong></p>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>收入增长驱动力拆解：历史收入增长是来自"量"还是"价"？</li>
              <li>盈利能力趋势：毛利率、营业利润率、ROIC 的稳定性</li>
              <li>现金流健康度：经营性现金流 vs. 净利润的对比</li>
              <li>再投资效率：资本支出与收入增长的关系</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-400">
      正在加载市场数据...
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { marketInfoKey, marketCodeKey, marketProfitForecastKey } from '@/types/market'

defineOptions({
  name: 'KeyMetricsCockpit'
})

// 注入父组件提供的数据
const marketInfo = inject(marketInfoKey)
const marketCode = inject(marketCodeKey)
const marketProfitForecast = inject(marketProfitForecastKey)

// 创建计算属性，方便使用特定的市场数据
const stockInfo = computed(() => {
  if (!marketInfo?.value) return null

  return {
    code: marketInfo.value['代码'] as string,
    name: marketInfo.value['名称'] as string,
    currentPrice: marketInfo.value['现价'] as number,
    change: marketInfo.value['涨跌'] as number,
    changePercent: marketInfo.value['涨幅'] as number,
    pe: marketInfo.value['市盈率(TTM)'] as number,
    pb: marketInfo.value['市净率'] as number,
    roe: marketInfo.value['每股收益'] as number,
  }
})

// 机构预测相关计算属性
const consensusLevel = computed(() => {
  if (!marketProfitForecast?.value || marketProfitForecast.value.length === 0) return 'N/A'

  const avgInstitutions = marketProfitForecast.value.reduce((sum, f) => sum + f.预测机构数, 0) / marketProfitForecast.value.length

  if (avgInstitutions >= 10) return '高'
  if (avgInstitutions >= 6) return '中'
  return '低'
})

const expectedGrowthRate = computed(() => {
  if (!marketProfitForecast?.value || marketProfitForecast.value.length === 0 || !stockInfo.value?.roe) return 'N/A'

  const currentEPS = stockInfo.value.roe
  const nextYearForecast = marketProfitForecast.value.find(f => parseInt(f.年度) === new Date().getFullYear() + 1)

  if (!nextYearForecast) return 'N/A'

  return (((nextYearForecast.均值 - currentEPS) / currentEPS) * 100).toFixed(1)
})

const forecastDispersion = computed(() => {
  if (!marketProfitForecast?.value || marketProfitForecast.value.length === 0) return 'N/A'

  // 计算预测的离散程度（最大值-最小值）/均值的平均
  const avgDispersion = marketProfitForecast.value.reduce((sum, f) => {
    const dispersion = (f.最大值 - f.最小值) / f.均值
    return sum + dispersion
  }, 0) / marketProfitForecast.value.length

  if (avgDispersion < 0.1) return '低'
  if (avgDispersion < 0.25) return '中'
  return '高'
})

const averageInstitutions = computed(() => {
  if (!marketProfitForecast?.value || marketProfitForecast.value.length === 0) return 0

  return Math.round(marketProfitForecast.value.reduce((sum, f) => sum + f.预测机构数, 0) / marketProfitForecast.value.length)
})

// 是否显示机构预测
const showForecastData = computed(() => {
  return !!(marketProfitForecast?.value && marketProfitForecast.value.length > 0)
})

// 预测数据年数
const forecastYears = computed(() => {
  return marketProfitForecast?.value?.length || 0
})

console.log('注入的市场信息:', marketInfo?.value)
console.log('注入的市场代码:', marketCode)
console.log('注入的利润预测:', marketProfitForecast?.value)

</script>