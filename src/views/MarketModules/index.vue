<template>
    <div class="market-modules flex flex-col">
        <el-steps :active="active" align-center class="mb-5">
            <el-icon v-if="active > STEPS_VALUE.ONE" class="cursor-pointer" @click="active--" size="24"><ArrowLeftBold  /></el-icon>
            <el-step v-for="step in stepsComputed" :key="step.value" :title="step.title" :description="step.description"
                :icon="step.icon" />
            <el-icon v-if="active < STEPS_VALUE.THREE" class="cursor-pointer" @click="active++" size="24"><ArrowRightBold /></el-icon>
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
import { marketInfoKey, marketCodeKey, marketProfitForecastKey, type ProfitForecastType, type FinancialAnalysisIndicatorType, marketFinancialAnalysisIndicatorKey } from '@/types/market';
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
const marketProfitForecast = ref<ProfitForecastType>([])
const marketFinancialAnalysisIndicator = ref<FinancialAnalysisIndicatorType>([])
console.log('Market ID:', marketCode)

// 提供数据给子组件
provide(marketInfoKey, marketInfo)
provide(marketCodeKey, marketCode)
provide(marketProfitForecastKey, marketProfitForecast)
provide(marketFinancialAnalysisIndicatorKey, marketFinancialAnalysisIndicator)

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
    marketFinancialAnalysisIndicator.value = [
        {
            "日期": "2025-03-31T00:00:00.000",
            "摊薄每股收益(元)": 0.1332,
            "加权每股收益(元)": 0.13,
            "每股收益_调整后(元)": 0.13,
            "扣除非经常性损益后的每股收益(元)": null,
            "每股净资产_调整前(元)": 8.3536,
            "每股净资产_调整后(元)": 8.3062,
            "每股经营性现金流(元)": 0.1156,
            "每股资本公积金(元)": 3.3342,
            "每股未分配利润(元)": 3.4655,
            "调整后的每股净资产(元)": null,
            "总资产利润率(%)": 1.2373,
            "主营业务利润率(%)": 23.2078,
            "总资产净利润率(%)": 1.1984,
            "成本费用利润率(%)": 19.0782,
            "营业利润率(%)": 16.1896,
            "主营业务成本率(%)": 75.5155,
            "销售净利率(%)": 13.4813,
            "股本报酬率(%)": 13.3153,
            "净资产报酬率(%)": 1.594,
            "资产报酬率(%)": 1.2373,
            "销售毛利率(%)": null,
            "三项费用比重": 8.038,
            "非主营比重": 18.1266,
            "主营利润比重": 143.3987,
            "股息发放率(%)": 0.0,
            "投资收益率(%)": 2.8402,
            "主营业务利润(元)": 102164500.83,
            "净资产收益率(%)": 1.6,
            "加权净资产收益率(%)": 1.61,
            "扣除非经常性损益后的净利润(元)": 50664031.03,
            "主营业务收入增长率(%)": -9.9592,
            "净利润增长率(%)": -1.4363,
            "净资产增长率(%)": 5.9244,
            "总资产增长率(%)": -6.1104,
            "应收账款周转率(次)": 0.7876,
            "应收账款周转天数(天)": 114.2712,
            "存货周转天数(天)": 158.9825,
            "存货周转率(次)": 0.5661,
            "固定资产周转率(次)": null,
            "总资产周转率(次)": 0.0889,
            "总资产周转天数(天)": 1012.3735,
            "流动资产周转率(次)": 0.131,
            "流动资产周转天数(天)": 687.0229,
            "股东权益周转率(次)": 0.1192,
            "流动比率": 3.1712,
            "速动比率": 2.5785,
            "现金比率(%)": 127.4523,
            "利息支付倍数": -2468.4536,
            "长期债务与营运资金比率(%)": null,
            "股东权益比率(%)": 77.6235,
            "长期负债比率(%)": null,
            "股东权益与固定资产比率(%)": null,
            "负债与所有者权益比率(%)": 28.8269,
            "长期资产与长期资金比率(%)": null,
            "资本化比率(%)": null,
            "固定资产净值率(%)": null,
            "资本固定化比率(%)": 42.6958,
            "产权比率(%)": 27.1601,
            "清算价值比率(%)": null,
            "固定资产比重(%)": null,
            "资产负债率(%)": 22.3765,
            "总资产(元)": 4796502715.74,
            "经营现金净流量对销售收入比率(%)": 0.117,
            "资产的经营现金流量回报率(%)": 0.0107,
            "经营现金净流量与净利润的比率(%)": 0.868,
            "经营现金净流量对负债比率(%)": 0.048,
            "现金流量比率(%)": 5.0941,
            "短期股票投资(元)": null,
            "短期债券投资(元)": null,
            "短期其它经营性投资(元)": null,
            "长期股票投资(元)": 244871344.74,
            "长期债券投资(元)": null,
            "长期其它经营性投资(元)": null,
            "1年以内应收帐款(元)": null,
            "1-2年以内应收帐款(元)": null,
            "2-3年以内应收帐款(元)": null,
            "3年以内应收帐款(元)": null,
            "1年以内预付货款(元)": null,
            "1-2年以内预付货款(元)": null,
            "2-3年以内预付货款(元)": null,
            "3年以内预付货款(元)": null,
            "1年以内其它应收款(元)": null,
            "1-2年以内其它应收款(元)": null,
            "2-3年以内其它应收款(元)": null,
            "3年以内其它应收款(元)": null
        },
        {
            "日期": "2025-06-30T00:00:00.000",
            "摊薄每股收益(元)": 0.3545,
            "加权每股收益(元)": 0.35,
            "每股收益_调整后(元)": 0.35,
            "扣除非经常性损益后的每股收益(元)": 0.31,
            "每股净资产_调整前(元)": 8.3427,
            "每股净资产_调整后(元)": 8.3104,
            "每股经营性现金流(元)": 0.4297,
            "每股资本公积金(元)": 3.3346,
            "每股未分配利润(元)": 3.6077,
            "调整后的每股净资产(元)": null,
            "总资产利润率(%)": 3.3294,
            "主营业务利润率(%)": 23.8918,
            "总资产净利润率(%)": 3.2067,
            "成本费用利润率(%)": 25.502,
            "营业利润率(%)": 20.2058,
            "主营业务成本率(%)": 74.9112,
            "销售净利率(%)": 17.282,
            "股本报酬率(%)": 182.6973,
            "净资产报酬率(%)": 21.8991,
            "资产报酬率(%)": 17.1603,
            "销售毛利率(%)": null,
            "三项费用比重": 3.1153,
            "非主营比重": 14.455,
            "主营利润比重": 118.2555,
            "股息发放率(%)": 0.2231,
            "投资收益率(%)": 5.9838,
            "主营业务利润(元)": 218408445.44,
            "净资产收益率(%)": 4.26,
            "加权净资产收益率(%)": 4.24,
            "扣除非经常性损益后的净利润(元)": 138198265.78,
            "主营业务收入增长率(%)": -15.3743,
            "净利润增长率(%)": 8.3746,
            "净资产增长率(%)": 5.2954,
            "总资产增长率(%)": -4.7279,
            "应收账款周转率(次)": 1.5842,
            "应收账款周转天数(天)": 113.622,
            "存货周转天数(天)": 157.0681,
            "存货周转率(次)": 1.146,
            "固定资产周转率(次)": 1.0863,
            "总资产周转率(次)": 0.1856,
            "总资产周转天数(天)": 969.8276,
            "流动资产周转率(次)": 0.2734,
            "流动资产周转天数(天)": 658.376,
            "股东权益周转率(次)": 0.2476,
            "流动比率": 3.2826,
            "速动比率": 2.6409,
            "现金比率(%)": 93.7281,
            "利息支付倍数": -230.1038,
            "长期债务与营运资金比率(%)": null,
            "股东权益比率(%)": 78.361,
            "长期负债比率(%)": null,
            "股东权益与固定资产比率(%)": 448.2156,
            "负债与所有者权益比率(%)": 27.6145,
            "长期资产与长期资金比率(%)": null,
            "资本化比率(%)": null,
            "固定资产净值率(%)": 55.8312,
            "资本固定化比率(%)": 42.3206,
            "产权比率(%)": 25.9838,
            "清算价值比率(%)": null,
            "固定资产比重(%)": 17.4829,
            "资产负债率(%)": 21.639,
            "总资产(元)": 4745174225.69,
            "经营现金净流量对销售收入比率(%)": 0.2095,
            "资产的经营现金流量回报率(%)": 0.0404,
            "经营现金净流量与净利润的比率(%)": 1.2124,
            "经营现金净流量对负债比率(%)": 0.1865,
            "现金流量比率(%)": 19.8245,
            "短期股票投资(元)": null,
            "短期债券投资(元)": null,
            "短期其它经营性投资(元)": null,
            "长期股票投资(元)": 254763650.04,
            "长期债券投资(元)": null,
            "长期其它经营性投资(元)": null,
            "1年以内应收帐款(元)": null,
            "1-2年以内应收帐款(元)": 23553441.41,
            "2-3年以内应收帐款(元)": 1884826.5,
            "3年以内应收帐款(元)": 55029489.15,
            "1年以内预付货款(元)": null,
            "1-2年以内预付货款(元)": 2300920.86,
            "2-3年以内预付货款(元)": 725085.6,
            "3年以内预付货款(元)": null,
            "1年以内其它应收款(元)": null,
            "1-2年以内其它应收款(元)": 598231.58,
            "2-3年以内其它应收款(元)": 702927.19,
            "3年以内其它应收款(元)": 2096532.23
        }
    ]
})
console.log("marketInfo", marketInfo)

</script>