<template>
    <div class="
        flex items-center justify-between 
        border border-[var(--el-color-primary-light-5)] rounded-lg p-4 
        bg-[#000a18] hover:bg-[var(--el-color-primary-light-9)]"
    >
        <div class="flex flex-col w-60">
            <div class="text-lg font-bold">
                <el-text type="primary">
                    {{ market.name }} - {{ market.description }}
                </el-text>
            </div>
            <div class="text-lg font-bold">
                <el-text type="primary">
                    $ {{ market.price }} (+1.5%)
                </el-text>
            </div>
            <div>
                <el-text type="primary">
                    more
                </el-text>
            </div>
        </div>
        <div class="flex items-center justify-center w-40 h-40">
            <el-text type="primary">logo</el-text>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Market } from '../types/market'

const props = defineProps<{
    market: Market
}>()

</script>

<style>

</style>
  