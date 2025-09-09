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

        <!-- 增长率滑块 -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <label class="text-lg font-medium text-gray-300">未来5年收入增长率</label>
            <span class="text-2xl font-bold text-cyan-400">{{ revenueGrowthRate }}%</span>
          </div>
          <div class="px-4">
            <el-slider v-model="revenueGrowthRate" :min="-10" :max="50" :step="0.5" :show-tooltip="false"
              class="mb-2" />
            <div class="flex justify-between text-sm text-gray-400">
              <span>-10%</span>
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        <!-- 其他财务参数 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">利润率 (%)</label>
            <el-slider v-model="profitMargin" :min="0" :max="30" :step="0.5" />
            <div class="text-center text-sm text-gray-400 mt-1">{{ profitMargin }}%</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">资本支出占收入比 (%)</label>
            <el-slider v-model="capexRatio" :min="0" :max="20" :step="0.5" />
            <div class="text-center text-sm text-gray-400 mt-1">{{ capexRatio }}%</div>
          </div>
        </div>

        <!-- DCF 计算结果 -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg border border-gray-500">
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
import { inject, computed, ref } from 'vue'
import { marketInfoKey, marketCodeKey } from '@/types/market'

defineOptions({
  name: 'MarketExpectation'
})

// 注入父组件提供的数据
const marketInfo = inject(marketInfoKey)
const marketCode = inject(marketCodeKey)

// DCF 模型参数
const revenueGrowthRate = ref(8.0) // 收入增长率
const profitMargin = ref(12.5) // 利润率
const capexRatio = ref(5.0) // 资本支出占收入比

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

// DCF 计算 - 简化版本
const calculatedValue = computed(() => {
  if (!stockInfo.value) return 0

  const currentEPS = stockInfo.value.eps || 0.5
  const growthRate = revenueGrowthRate.value / 100
  const discountRate = 0.1 // 假设10%折现率

  let totalPV = 0
  let futureEPS = currentEPS

  // 计算未来5年的现值
  for (let year = 1; year <= 5; year++) {
    futureEPS = futureEPS * (1 + growthRate)
    const yearPV = futureEPS / Math.pow(1 + discountRate, year)
    totalPV += yearPV
  }

  // 终值（简化计算）
  const terminalValue = (futureEPS * 15) / Math.pow(1 + discountRate, 5)

  return totalPV + terminalValue
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