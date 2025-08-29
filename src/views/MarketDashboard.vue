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
          <el-button type="primary" plain round >Search</el-button>
      </div>
    </div>
  <div class="flex flex-wrap gap-10">
    <MarketCard v-for="market in filteredMarketList" :key="market.id" :market="market" @click="handleMarketClick(market)" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import MarketCard from '@/components/MarketCard.vue'
import type { Market } from '@/types/market'
import { useRouter } from 'vue-router'

const router = useRouter()

const keyword = ref('')

const marketList: Ref<Market[]> = ref([
  {
    id: 1,
    name: 'Apple (AAPL)',
    description: 'Apple Inc.',
    link: 'https://www.apple.com',
    logo: 'https://www.apple.com/favicon.ico',
    price: 175.20,
  },
  {
    id: 2,
    name: 'Microsoft (MSFT)',
    description: 'Microsoft Corporation',
    link: 'https://www.microsoft.com',
    logo: 'https://www.microsoft.com/favicon.ico',
    price: 235.77,
  }
])

const filteredMarketList = computed(() => {
  return marketList.value.filter((market) => {
    return market.name.toLowerCase().includes(keyword.value.trim().toLowerCase())
  })
})

const handleMarketClick = (market: Market) => {
  router.push(`/markets/${market.id}`)
}
</script>