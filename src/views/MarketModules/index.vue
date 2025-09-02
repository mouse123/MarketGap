<template>
    <div class="market-modules flex flex-col">
        <el-steps :active="active" align-center class="mb-5">
            <el-step v-for="step in stepsComputed" :key="step.value" 
                :title="step.title" :description="step.description" :icon="step.icon"
            />
        </el-steps>
        <MarketExpectation v-if="active === STEPS_VALUE.ONE" />
        <KeyMetricsCockpit v-if="active === STEPS_VALUE.TWO" />
        <ThesisInsightRecorder v-if="active === STEPS_VALUE.THREE" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import MarketExpectation from './MarketExpectation.vue';
import KeyMetricsCockpit from './KeyMetricsCockpit.vue';
import ThesisInsightRecorder from './ThesisInsightRecorder.vue';

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

const stepsComputed = computed(()=>{
    return steps.filter(step=>{
        return step.value === active.value
    })
})

const route = useRoute()
const active = ref(STEPS_VALUE.ONE)

// 获取市场ID
const marketId = route.params.id
console.log('Market ID:', marketId)

</script>