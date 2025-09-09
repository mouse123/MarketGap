<template>
  <div class="thesis-recorder p-6">
    <h2 class="text-2xl font-bold mb-6">投资论证记录器</h2>

    <div v-if="stockInfo" class="space-y-8">
      <!-- 股票信息概览 -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-purple-800">分析标的</h3>
          <div class="text-right">
            <div class="text-sm text-gray-600">分析时间</div>
            <div class="text-sm font-medium">{{ currentDateTime }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span class="text-sm text-gray-600">股票代码：</span>
            <span class="font-bold text-purple-700">{{ stockInfo.code }}</span>
          </div>
          <div>
            <span class="text-sm text-gray-600">公司名称：</span>
            <span class="font-bold text-purple-700">{{ stockInfo.name }}</span>
          </div>
          <div>
            <span class="text-sm text-gray-600">当前股价：</span>
            <span class="font-bold text-purple-700">¥{{ stockInfo.currentPrice }}</span>
          </div>
          <div>
            <span class="text-sm text-gray-600">市盈率：</span>
            <span class="font-bold text-purple-700">{{ stockInfo.pe?.toFixed(2) || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- 结构化编辑器 -->
      <div class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">

        <!-- 我的判断 -->
        <div class="border-b border-gray-200">
          <div class="bg-blue-50 px-6 py-4">
            <h3 class="text-lg font-semibold text-blue-800 flex items-center">
              <span class="mr-2">🎯</span>
              我的判断 (My Thesis)
            </h3>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">预期增长率 (%)</label>
              <div class="flex items-center space-x-4">
                <el-slider v-model="expectedGrowthRate" :min="-10" :max="50" :step="0.5" class="flex-1" />
                <span class="text-lg font-bold text-blue-600 w-16">{{ expectedGrowthRate }}%</span>
              </div>
            </div>
            <div class="mb-4 p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                我认为 <strong>{{ stockInfo.name }}</strong> 未来的增长率会是
                <span class="text-lg font-bold">{{ expectedGrowthRate }}%</span>，
                <span v-if="growthComparison > 0" class="text-green-600 font-semibold">
                  高于市场隐含预期 {{ Math.abs(growthComparison).toFixed(1) }} 个百分点
                </span>
                <span v-else-if="growthComparison < 0" class="text-red-600 font-semibold">
                  低于市场隐含预期 {{ Math.abs(growthComparison).toFixed(1) }} 个百分点
                </span>
                <span v-else class="text-gray-600 font-semibold">与市场预期基本一致</span>
              </p>
            </div>
            <el-input v-model="thesis.judgment" type="textarea" :rows="4" placeholder="详细阐述你的判断理由..." class="w-full" />
          </div>
        </div>

        <!-- 支持证据 -->
        <div class="border-b border-gray-200">
          <div class="bg-green-50 px-6 py-4">
            <h3 class="text-lg font-semibold text-green-800 flex items-center">
              <span class="mr-2">📊</span>
              支持证据 (Supporting Evidence)
            </h3>
            <p class="text-sm text-green-600 mt-1">基于"核心指标驾驶舱"的数据，说明你的判断依据</p>
          </div>
          <div class="p-6">
            <!-- 快速插入数据按钮 -->
            <div class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">快速插入关键数据：</div>
              <div class="flex flex-wrap gap-2">
                <el-button size="small" type="primary" plain @click="insertMetric('pe', stockInfo.pe)">
                  市盈率: {{ stockInfo.pe?.toFixed(2) }}
                </el-button>
                <el-button size="small" type="success" plain @click="insertMetric('pb', stockInfo.pb)">
                  市净率: {{ stockInfo.pb?.toFixed(2) }}
                </el-button>
                <el-button size="small" type="warning" plain @click="insertMetric('roe', stockInfo.roe)">
                  每股收益: {{ stockInfo.roe?.toFixed(2) }}
                </el-button>
              </div>
            </div>
            <el-input v-model="thesis.evidence" type="textarea" :rows="6" placeholder="例如：
• ROIC连续三年提升，从15%增长到20%
• 新产品市场反馈良好，预期贡献30%收入增长
• 行业龙头地位稳固，市场占有率持续扩大
• 管理团队执行力强，历史承诺兑现率90%+" class="w-full" />
          </div>
        </div>

        <!-- 核心风险 -->
        <div>
          <div class="bg-red-50 px-6 py-4">
            <h3 class="text-lg font-semibold text-red-800 flex items-center">
              <span class="mr-2">⚠️</span>
              核心风险 (Key Risks)
            </h3>
            <p class="text-sm text-red-600 mt-1">什么情况发生会导致你的判断是错误的？</p>
          </div>
          <div class="p-6">
            <el-input v-model="thesis.risks" type="textarea" :rows="6" placeholder="例如：
• 竞争对手推出颠覆性技术，冲击现有业务模式
• 核心管理层离职，影响战略执行
• 宏观经济下行，影响下游需求
• 政策环境变化，增加合规成本
• 原材料价格大幅上涨，压缩利润空间" class="w-full" />
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          💡 提示：完整的投资逻辑应该包含判断、证据和风险三个维度
        </div>
        <div class="space-x-3">
          <el-button type="default" @click="clearAll">清空重写</el-button>
          <el-button type="primary" @click="saveThesis">保存论证</el-button>
          <el-button type="success" @click="exportThesis">导出报告</el-button>
        </div>
      </div>

      <!-- 论证完整度指示器 -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="text-sm font-medium text-gray-700 mb-2">论证完整度</div>
        <div class="flex space-x-2">
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1">
              <span>判断</span>
              <span>{{ judegmentCompletion }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full transition-all" :style="{ width: judegmentCompletion + '%' }">
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1">
              <span>证据</span>
              <span>{{ evidenceCompletion }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: evidenceCompletion + '%' }">
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1">
              <span>风险</span>
              <span>{{ risksCompletion }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-red-500 h-2 rounded-full transition-all" :style="{ width: risksCompletion + '%' }"></div>
            </div>
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
import { inject, computed, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { marketInfoKey, marketCodeKey } from '@/types/market'

defineOptions({
  name: 'ThesisRecorder'
})

// 注入父组件提供的数据
const marketInfo = inject(marketInfoKey)
const marketCode = inject(marketCodeKey)

// 论证数据
const thesis = reactive({
  judgment: '',
  evidence: '',
  risks: ''
})

// 预期增长率
const expectedGrowthRate = ref(10.0)

// 获取股票信息
const stockInfo = computed(() => {
  if (!marketInfo?.value) return null

  return {
    code: marketInfo.value['代码'] as string,
    name: marketInfo.value['名称'] as string,
    currentPrice: marketInfo.value['现价'] as number,
    pe: marketInfo.value['市盈率(TTM)'] as number,
    pb: marketInfo.value['市净率'] as number,
    roe: marketInfo.value['每股收益'] as number,
    marketCap: marketInfo.value['流通值'] as number,
    eps: marketInfo.value['每股收益'] as number,
  }
})

// 当前日期时间
const currentDateTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 计算与市场隐含预期的差异
const growthComparison = computed(() => {
  if (!stockInfo.value) return 0

  // 简化计算：基于PE反推市场隐含增长率
  const currentPE = stockInfo.value.pe || 15
  const impliedGrowthRate = Math.max(0, (currentPE - 10) * 2) // 简化公式

  return expectedGrowthRate.value - impliedGrowthRate
})

// 计算各部分完整度
const judegmentCompletion = computed(() => {
  const judgmentLength = thesis.judgment.length
  if (judgmentLength === 0) return 0
  if (judgmentLength < 50) return 30
  if (judgmentLength < 100) return 60
  if (judgmentLength < 200) return 85
  return 100
})

const evidenceCompletion = computed(() => {
  const evidenceLength = thesis.evidence.length
  if (evidenceLength === 0) return 0
  if (evidenceLength < 100) return 25
  if (evidenceLength < 200) return 50
  if (evidenceLength < 400) return 75
  return 100
})

const risksCompletion = computed(() => {
  const risksLength = thesis.risks.length
  if (risksLength === 0) return 0
  if (risksLength < 100) return 25
  if (risksLength < 200) return 50
  if (risksLength < 400) return 75
  return 100
})

// 插入指标数据到证据中
const insertMetric = (type: string, value: number | undefined) => {
  if (!value) return

  let metricText = ''
  switch (type) {
    case 'pe':
      metricText = `市盈率为${value.toFixed(2)}，`
      break
    case 'pb':
      metricText = `市净率为${value.toFixed(2)}，`
      break
    case 'roe':
      metricText = `每股收益为${value.toFixed(2)}元，`
      break
  }

  // 在证据文本框当前位置插入
  if (thesis.evidence) {
    thesis.evidence += '\n• ' + metricText
  } else {
    thesis.evidence = '• ' + metricText
  }
}

// 清空所有内容
const clearAll = () => {
  thesis.judgment = ''
  thesis.evidence = ''
  thesis.risks = ''
  expectedGrowthRate.value = 10.0
  ElMessage.success('已清空所有内容')
}

// 保存论证
const saveThesis = () => {
  if (!thesis.judgment && !thesis.evidence && !thesis.risks) {
    ElMessage.warning('请至少填写一个部分的内容')
    return
  }

  const thesisData = {
    stockInfo: stockInfo.value,
    expectedGrowthRate: expectedGrowthRate.value,
    thesis: { ...thesis },
    timestamp: new Date().toISOString(),
    completeness: {
      judgment: judegmentCompletion.value,
      evidence: evidenceCompletion.value,
      risks: risksCompletion.value
    }
  }

  // 这里可以保存到 localStorage 或发送到服务器
  localStorage.setItem(`thesis_${stockInfo.value?.code}_${Date.now()}`, JSON.stringify(thesisData))
  ElMessage.success('论证已保存')
}

// 导出论证报告
const exportThesis = () => {
  if (!stockInfo.value || (!thesis.judgment && !thesis.evidence && !thesis.risks)) {
    ElMessage.warning('请先完善论证内容')
    return
  }

  const report = `
投资论证报告
==========================================

分析标的: ${stockInfo.value.name} (${stockInfo.value.code})
分析时间: ${currentDateTime.value}
当前股价: ¥${stockInfo.value.currentPrice}
预期增长率: ${expectedGrowthRate.value}%

🎯 我的判断 (My Thesis)
==========================================
${thesis.judgment || '未填写'}

📊 支持证据 (Supporting Evidence)
==========================================
${thesis.evidence || '未填写'}

⚠️ 核心风险 (Key Risks)
==========================================
${thesis.risks || '未填写'}

==========================================
报告生成时间: ${new Date().toLocaleString('zh-CN')}
`

  // 创建下载链接
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `投资论证_${stockInfo.value.code}_${Date.now()}.txt`
  link.click()
  URL.revokeObjectURL(url)

  ElMessage.success('报告已导出')
}

console.log('ThesisRecorder - 注入的数据:', { marketInfo: marketInfo?.value, marketCode })

</script>