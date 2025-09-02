<template>
  <div class="flex items-center justify-between gap-4 mb-10">
      <div class="flex items-center gap-2">
        <img src="@/assets/logo.png" alt="logo" srcset="" class="w-10 h-10">
        <div class="text-xl font-bold ml-4">Market Gap</div>
      </div>
      <div class="flex items-center gap-2">
        <el-input 
          style="width:250px;" 
          v-model="keyword" 
          placeholder="Search"  />
          <el-button type="primary" plain round @click="addStock">Start Find Stock Gap</el-button>
      </div>
    </div>
  <div class="flex flex-wrap gap-10">
    <MarketCard v-for="market in filteredMarketList" :key="market.id" :market="market" @click="handleMarketClick(market)" />
  </div>

  <AddStockDialog ref="addStockDialog" @confirm="addStockConfirm" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MarketCard from '@/components/MarketCard.vue'
import { useRouter } from 'vue-router'
import stock from '@/server/eastmoney/stock_zh_a_spot_em.json'
import type { EastmoneyMarketEn } from '@/types/market'
import AddStockDialog from '@/views/AddStockDialog.vue'

const router = useRouter()

const keyword = ref('')
const addStockDialog = ref<InstanceType<typeof AddStockDialog> | null>(null)

console.log("stock",stock)

const marketList = ref([])

const filteredMarketList = computed(() => {
  return marketList.value.filter((market) => {
    return market?.code.toLowerCase().includes(keyword.value.trim().toLowerCase())
  })
})

const handleMarketClick = (market: EastmoneyMarketEn) => {
  router.push(`/markets/${market.code}`)
}

const addStock = ()=>{
  addStockDialog.value?.open()
}

const addStockConfirm = (stock: string) => {
  console.log("addStockConfirm",stock)
}
</script>