<template>
  <div class="market-expectation p-6 bg-gray-900 text-white min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-blue-400">市场预期透视镜</h2>

    <div v-if="stockInfo" class="space-y-8">
      <!-- 股票基础信息 -->
      <div class="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg border border-gray-600">
        <h3 class="text-xl font-semibold mb-4 text-blue-400">当前市场状况</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-sm text-gray-400">股票代码</div>
            <div class="text-lg font-bold text-blue-300">{{ stockInfo.code }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">公司名称</div>
            <div class="text-lg font-bold text-blue-300">{{ stockInfo.name }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">当前股价</div>
            <div class="text-xl font-bold text-yellow-400">¥{{ stockInfo.currentPrice }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400">总市值</div>
            <div class="text-lg font-bold text-blue-300">{{ formatMarketCap(stockInfo.totalMarketCap) }}</div>
          </div>
        </div>
      </div>

      <!-- DCF 模型调节器 -->
      <div class="bg-gray-800 border-2 border-gray-600 p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-6 text-green-400">DCF 估值模型</h3>


        <!-- 机构预测数据展示 -->
        <div v-if="showForecastData" class="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h4 class="text-sm font-medium text-gray-300 mb-3">🏛️ 机构预测数据</h4>
          <div class="grid grid-cols-1 gap-3">
            <div v-for="forecast in forecastDataList" :key="forecast.年度"
              class="flex justify-between items-center text-sm">
              <span class="text-gray-400">{{ forecast.年度 }}年EPS：</span>
              <span class="text-green-400 font-medium">
                ¥{{ forecast.均值.toFixed(2) }}
                <span class="text-xs text-gray-500">({{ forecast.预测机构数 }}家机构)</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 无机构预测时的提示 -->
        <div v-else class="mb-6 p-4 bg-yellow-800 bg-opacity-30 rounded-lg border border-yellow-600">
          <div class="flex items-center text-yellow-400">
            <span class="mr-2">⚠️</span>
            <span class="text-sm">暂无机构预测数据，无法进行DCF估值</span>
          </div>
        </div>

        <!-- DCF 计算结果 -->
        <div v-if="showForecastData"
          class="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg border border-gray-500">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-gray-200">DCF 估值结果</h4>
            <div class="text-xs text-gray-400">
              <span>🏛️ 基于机构预测</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-sm text-gray-300">预期内在价值</div>
              <div class="text-2xl font-bold text-green-400">¥{{ calculatedValue.toFixed(2) }}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-300">价值偏差</div>
              <div class="text-xl font-bold" :class="valueDeviation >= 0 ? 'text-red-400' : 'text-green-400'">
                {{ valueDeviation >= 0 ? '+' : '' }}{{ valueDeviation.toFixed(1) }}%
              </div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-300">投资建议</div>
              <div class="text-lg font-bold" :class="getInvestmentAdviceColor()">
                {{ getInvestmentAdvice() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 机构利润预测 -->
      <div v-if="showForecastData" class="bg-gray-800 border-l-4 border-purple-400 p-6 rounded-lg">
        <h3 class="text-lg font-semibold mb-4 text-purple-400">📊 机构利润预测</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-600">
                <th class="text-left py-2 text-gray-300">年度</th>
                <th class="text-center py-2 text-gray-300">机构数</th>
                <th class="text-center py-2 text-gray-300">预测均值</th>
                <th class="text-center py-2 text-gray-300">预测区间</th>
                <th class="text-center py-2 text-gray-300">行业均值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="forecast in forecastDataList" :key="forecast.年度" class="border-b border-gray-700">
                <td class="py-2 font-medium text-purple-300">{{ forecast.年度 }}</td>
                <td class="text-center py-2 text-gray-200">{{ forecast.预测机构数 }}</td>
                <td class="text-center py-2 font-bold text-green-400">¥{{ forecast.均值?.toFixed(2) }}</td>
                <td class="text-center py-2 text-gray-300">
                  ¥{{ forecast.最小值?.toFixed(2) }} - ¥{{ forecast.最大值?.toFixed(2) }}
                </td>
                <td class="text-center py-2 text-blue-300">¥{{ forecast.行业平均数?.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 p-3 bg-gray-700 rounded-lg">
          <p class="text-xs text-gray-300">
            💡 <strong>机构预测洞察：</strong>
            <span v-if="institutionForecastInsight">{{ institutionForecastInsight }}</span>
          </p>
        </div>
      </div>

      <!-- 市场隐含预期 -->
      <div class="bg-gray-800 border-l-4 border-yellow-400 p-6 rounded-lg">
        <h3 class="text-lg font-semibold mb-3 text-yellow-400">💡 市场隐含预期分析</h3>
        <p class="text-gray-200 text-lg leading-relaxed">
          <strong>关键发现：</strong>为了支撑当前股价 <span class="font-bold text-yellow-400">¥{{ stockInfo.currentPrice }}</span>，
          市场隐含的预期是，<span class="font-bold text-yellow-400">{{ stockInfo.name }}</span>
          未来5年的年均收入增长率需要达到
          <span class="text-2xl font-bold text-red-400">{{ impliedGrowthRate.toFixed(1) }}%</span>。
        </p>
        <div class="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <p class="text-sm text-gray-300">
            <strong>计算说明：</strong>FCF（自由现金流） = 经营活动现金流 - 资本性支出 (CapEx)
          </p>
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
  name: 'MarketExpectation'
})

// 注入父组件提供的数据
const marketInfo = inject(marketInfoKey)
const marketCode = inject(marketCodeKey)
const marketProfitForecast = inject(marketProfitForecastKey)


// 获取股票信息
const stockInfo = computed(() => {
  if (!marketInfo?.value) return null

  return {
    code: marketInfo.value['代码'] as string,
    name: marketInfo.value['名称'] as string,
    currentPrice: marketInfo.value['现价'] as number,
    totalMarketCap: marketInfo.value['资产净值/总市值'] as number,
    marketCap: marketInfo.value['流通值'] as number,
    shares: marketInfo.value['流通股'] as number,
    pe: marketInfo.value['市盈率(TTM)'] as number,
    eps: marketInfo.value['每股收益'] as number,
  }
})

// 格式化市值显示
const formatMarketCap = (value: number) => {
  if (!value) return 'N/A'
  if (value >= 1e8) return `${(value / 1e8).toFixed(1)}亿`
  if (value >= 1e4) return `${(value / 1e4).toFixed(1)}万`
  return value.toString()
}

// 机构预测洞察
const institutionForecastInsight = computed(() => {
  if (!marketProfitForecast?.value || marketProfitForecast.value.length === 0) return ''

  const forecasts = marketProfitForecast.value
  const currentYear = new Date().getFullYear()
  const nextYearForecast = forecasts.find(f => parseInt(f.年度) === currentYear + 1)

  if (!nextYearForecast) return ''

  const growthRate = nextYearForecast.均值 > (stockInfo.value?.eps || 0)
    ? ((nextYearForecast.均值 - (stockInfo.value?.eps || 0)) / (stockInfo.value?.eps || 1)) * 100
    : 0

  const consensus = nextYearForecast.预测机构数 >= 8 ? '高' : nextYearForecast.预测机构数 >= 5 ? '中' : '低'

  return `${forecasts.length}年预测显示${consensus}度机构共识，预期${currentYear + 1}年EPS增长${growthRate.toFixed(1)}%`
})

// 是否显示机构预测
const showForecastData = computed(() => {
  return !!(marketProfitForecast?.value && marketProfitForecast.value.length > 0)
})

// 获取机构预测数据（用于模板）
const forecastDataList = computed(() => {
  return marketProfitForecast?.value || []
})


// DCF 计算 - 仅基于机构预测数据
const calculatedValue = computed(() => {
  if (!stockInfo.value || !showForecastData.value || !marketProfitForecast?.value) return 0

  const discountRate = 0.1 // 假设10%折现率
  let totalPV = 0

  // 只使用机构预测数据进行DCF计算
  marketProfitForecast.value.forEach((forecast, index) => {
    const year = index + 1
    const futureEPS = forecast.均值
    const yearPV = futureEPS / Math.pow(1 + discountRate, year)
    totalPV += yearPV
  })

  // 终值计算：使用最后一年的预测EPS
  const lastYearForecast = marketProfitForecast.value[marketProfitForecast.value.length - 1]
  if (lastYearForecast) {
    const terminalEPS = lastYearForecast.均值
    const lastYear = marketProfitForecast.value.length
    const terminalValue = (terminalEPS * 15) / Math.pow(1 + discountRate, lastYear)
    totalPV += terminalValue
  }

  return totalPV
})

// 价值偏差百分比
const valueDeviation = computed(() => {
  if (!stockInfo.value) return 0
  const currentPrice = stockInfo.value.currentPrice
  const intrinsicValue = calculatedValue.value
  return ((currentPrice - intrinsicValue) / intrinsicValue) * 100
})

// 市场隐含增长率（反向计算）
const impliedGrowthRate = computed(() => {
  if (!stockInfo.value) return 0

  const currentPrice = stockInfo.value.currentPrice
  const currentEPS = stockInfo.value.eps || 0.5

  // 简化的反向计算：基于当前PE和目标价格推算需要的增长率
  const requiredEPS = currentPrice / 15 // 假设合理PE为15
  const yearsToProject = 5
  const requiredGrowthRate = Math.pow(requiredEPS / currentEPS, 1 / yearsToProject) - 1

  return requiredGrowthRate * 100
})

// 投资建议
const getInvestmentAdvice = () => {
  const deviation = valueDeviation.value
  if (deviation > 20) return '高估'
  if (deviation > 5) return '略高估'
  if (deviation < -20) return '低估'
  if (deviation < -5) return '略低估'
  return '合理估值'
}

// 投资建议颜色 (夜间模式)
const getInvestmentAdviceColor = () => {
  const deviation = valueDeviation.value
  if (deviation > 20) return 'text-red-400'
  if (deviation > 5) return 'text-orange-400'
  if (deviation < -20) return 'text-green-400'
  if (deviation < -5) return 'text-green-300'
  return 'text-gray-300'
}

console.log('MarketExpectation - 注入的数据:', { marketInfo: marketInfo?.value, marketCode })

</script>
<style scoped></style>