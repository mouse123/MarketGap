<template>
    <div class="market-modules flex flex-col">
        <el-steps :active="step" align-center class="mb-5">
            <el-step title="Market Expectation Lens" description="市场预期透视镜" />
            <el-step title="Key Metrics Cockpit" description="核心指标驾驶舱" />
            <el-step title="Thesis Insight Recorder" description="论点洞察记录器" />
        </el-steps>
        <div v-if="step === 1">
            <MarketExpectation />
        </div>
        <div v-if="step === 2">
            <KeyMetricsCockpit />
        </div>
        <div v-if="step === 3">
            <ThesisInsightRecorder />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import MarketExpectation from './MarketExpectation.vue';
import KeyMetricsCockpit from './KeyMetricsCockpit.vue';
import ThesisInsightRecorder from './ThesisInsightRecorder.vue';

defineOptions({
  name: 'MarketModules'
})

const route = useRoute()
const step = ref(1)

// 获取市场ID
const marketId = route.params.id
console.log('Market ID:', marketId)

</script>