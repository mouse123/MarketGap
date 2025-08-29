<template>
    结构化论证编辑器
    提供一个极简的文本编辑器，但包含三个固定的标题：
    我的判断 (My Thesis)：我认为公司未来的增长率会是 [用户输入Y%]，高于/低于市场预期的X%。
    支持证据 (Supporting Evidence)：基于“核心指标驾驶舱”的数据，我为什么这么认为？（例如：因为我看到它的ROIC连续三年提升，新产品市场反馈良好...）
    核心风险 (Key Risks)：什么情况发生会导致我的判断是错的？（例如：竞争对手推出颠覆性技术、核心管理层离职...）
    价值：强迫用户将思考过程结构化、书面化，形成一个完整的、可被追溯的投资逻辑。
</template>

<script setup lang="ts">

defineOptions({
  name: 'ThesisRecorder'
})

</script>