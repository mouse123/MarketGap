<template>
  <div class="key-metrics-cockpit p-6">
    <h2 class="text-2xl font-bold mb-6">关键指标驾驶舱</h2>

    <div v-if="stockInfo" class="space-y-6">
      <!-- 基础信息 -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">基础信息</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-600">代码</div>
            <div class="text-lg font-bold">{{ stockInfo.code }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">名称</div>
            <div class="text-lg font-bold">{{ stockInfo.name }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">现价</div>
            <div class="text-lg font-bold">¥{{ stockInfo.currentPrice }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">涨跌</div>
            <div class="text-lg font-bold" :class="stockInfo.change >= 0 ? 'text-red-600' : 'text-green-600'">
              {{ stockInfo.change >= 0 ? '+' : '' }}{{ stockInfo.change }}
              ({{ stockInfo.changePercent }}%)
            </div>
          </div>
        </div>
      </div>

      <!-- 估值指标 -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">估值指标</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-600">市盈率(TTM)</div>
            <div class="text-xl font-bold text-blue-600">{{ stockInfo.pe?.toFixed(2) || 'N/A' }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">市净率</div>
            <div class="text-xl font-bold text-blue-600">{{ stockInfo.pb?.toFixed(2) || 'N/A' }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">每股收益</div>
            <div class="text-xl font-bold text-blue-600">¥{{ stockInfo.roe?.toFixed(2) || 'N/A' }}</div>
          </div>
        </div>
      </div>

      <!-- 预期合理性分析 -->
      <div class="bg-green-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">市场预期分析</h3>
        <div class="space-y-3">
          <p class="text-sm text-gray-700">
            基于当前 PE: {{ stockInfo.pe?.toFixed(2) }}，市场对该股票的预期
            <span v-if="stockInfo.pe && stockInfo.pe > 25" class="text-red-600 font-semibold">偏高</span>
            <span v-else-if="stockInfo.pe && stockInfo.pe > 15" class="text-yellow-600 font-semibold">适中</span>
            <span v-else class="text-green-600 font-semibold">保守</span>
          </p>

          <div class="text-sm text-gray-600">
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

    <div v-else class="text-center py-8 text-gray-500">
      正在加载市场数据...
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { marketInfoKey, marketCodeKey } from '@/types/market'

defineOptions({
  name: 'KeyMetricsCockpit'
})

// 注入父组件提供的数据
const marketInfo = inject(marketInfoKey)
const marketCode = inject(marketCodeKey)

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

console.log('注入的市场信息:', marketInfo?.value)
console.log('注入的市场代码:', marketCode)

</script>