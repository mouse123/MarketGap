<template>
    <div class="market-modules flex flex-col">
        <el-steps :active="active" align-center class="mb-5">
            <el-step v-for="step in stepsComputed" :key="step.value" :title="step.title" :description="step.description"
                :icon="step.icon" />
        </el-steps>
        <MarketExpectation v-if="active === STEPS_VALUE.ONE" />
        <KeyMetricsCockpit v-if="active === STEPS_VALUE.TWO" />
        <ThesisInsightRecorder v-if="active === STEPS_VALUE.THREE" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router';
import { convertArrayToObject } from '@/utils';
import { marketInfoKey, marketCodeKey, marketProfitForecastKey, type ProfitForecastType } from '@/types/market';
import MarketExpectation from './MarketExpectation.vue';
import KeyMetricsCockpit from './KeyMetricsCockpit.vue';
import ThesisInsightRecorder from './ThesisInsightRecorder.vue';
// import {getXueqiuByCode} from '@/server/index.js';

defineOptions({
    name: 'MarketModules'
})

const STEPS_VALUE = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3
}

const steps = [{
    value: STEPS_VALUE.ONE,
    title: 'Market Expectation Lens',
    description: '市场预期透视镜',
    icon: 'PieChart'
}, {
    value: STEPS_VALUE.TWO,
    title: 'Key Metrics Cockpit',
    description: '核心指标驾驶舱',
    icon: 'Stopwatch'
}, {
    value: STEPS_VALUE.THREE,
    title: 'Thesis Insight Recorder',
    description: '论点洞察记录器',
    icon: 'Key'
}]

const stepsComputed = computed(() => {
    return steps.filter(step => {
        return step.value === active.value
    })
})

const route = useRoute()
const active = ref(STEPS_VALUE.ONE)

// 获取市场ID
const marketCode = route.params.id
const marketInfo = ref<Record<string, unknown> | null>(null)
const marketProfitForecast = ref<ProfitForecastType | null>(null)
console.log('Market ID:', marketCode)

// 提供数据给子组件
provide(marketInfoKey, marketInfo)
provide(marketCodeKey, marketCode)
provide(marketProfitForecastKey, marketProfitForecast)

onMounted(async () => {
    // const detail = await getXueqiuByCode(marketCode)
    // console.log('detail',detail)

    // 原始数组数据
    marketInfo.value = convertArrayToObject([
        {
            "item": "代码",
            "value": "SZ002026"
        },
        {
            "item": "52周最高",
            "value": 14.8
        },
        {
            "item": "流通股",
            "value": 422993749
        },
        {
            "item": "跌停",
            "value": 12.75
        },
        {
            "item": "最高",
            "value": 14.3
        },
        {
            "item": "流通值",
            "value": 5972671736
        },
        {
            "item": "最小交易单位",
            "value": 100
        },
        {
            "item": "涨跌",
            "value": -0.05
        },
        {
            "item": "每股收益",
            "value": 0.71
        },
        {
            "item": "昨收",
            "value": 14.17
        },
        {
            "item": "成交量",
            "value": 15686854
        },
        {
            "item": "周转率",
            "value": 3.71
        },
        {
            "item": "52周最低",
            "value": 7.1887
        },
        {
            "item": "名称",
            "value": "山东威达"
        },
        {
            "item": "交易所",
            "value": "SZ"
        },
        {
            "item": "市盈率(动)",
            "value": 19.701
        },
        {
            "item": "基金份额/总股本",
            "value": 440531939
        },
        {
            "item": "净资产中的商誉",
            "value": 0.0899747685
        },
        {
            "item": "均价",
            "value": 14.053
        },
        {
            "item": "涨幅",
            "value": -0.35
        },
        {
            "item": "振幅",
            "value": 3.03
        },
        {
            "item": "现价",
            "value": 14.12
        },
        {
            "item": "今年以来涨幅",
            "value": 44.48
        },
        {
            "item": "发行日期",
            "value": "2004-07-27 00:00:00"
        },
        {
            "item": "最低",
            "value": 13.87
        },
        {
            "item": "资产净值/总市值",
            "value": 6220310979
        },
        {
            "item": "股息(TTM)",
            "value": 0.141
        },
        {
            "item": "股息率(TTM)",
            "value": 0.999
        },
        {
            "item": "货币",
            "value": "CNY"
        },
        {
            "item": "每股净资产",
            "value": 8.3104
        },
        {
            "item": "市盈率(静)",
            "value": 20.733
        },
        {
            "item": "成交额",
            "value": 220443101.46
        },
        {
            "item": "市净率",
            "value": 1.699
        },
        {
            "item": "涨停",
            "value": 15.59
        },
        {
            "item": "市盈率(TTM)",
            "value": 19.843
        },
        {
            "item": "时间",
            "value": "2025-09-09 15:04:45"
        },
        {
            "item": "今开",
            "value": 14.04
        }
    ])
    marketProfitForecast.value = [
        {
            "年度": "2025",
            "预测机构数": 9,
            "最小值": 0.63,
            "均值": 0.74,
            "最大值": 0.77,
            "行业平均数": 1.68
        },
        {
            "年度": "2026",
            "预测机构数": 9,
            "最小值": 0.75,
            "均值": 0.84,
            "最大值": 0.88,
            "行业平均数": 2.07
        },
        {
            "年度": "2027",
            "预测机构数": 7,
            "最小值": 0.85,
            "均值": 0.93,
            "最大值": 0.97,
            "行业平均数": 2.52
        }
    ]
})
console.log("marketInfo", marketInfo)

</script>