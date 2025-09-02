<template>
  <el-dialog v-model="dialogVisible" title="Add Stock" width="500" :before-close="beforeClose">
    <el-form :model="form" ref="formRef" :rules="formRules">
      <el-form-item label="Stock" label-width="100px" prop="stock">
        <el-select-v2 
        v-model="form.stock"
        :options="options"
        filterable
        clearable
        placeholder="Please select a stock">
        </el-select-v2>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button round @click="dialogVisible = false">Cancel</el-button>
        <el-button round type="primary" plain @click="handleConfirm">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue' 
import stock from '@/server/eastmoney/stock_zh_a_spot_em.json'
import type { EastmoneyMarket,EastmoneyMarketEn } from '@/types/market'
import { eastmoneyMarketZhToEn } from '@/utils'
import type { Ref } from 'vue'
import type { FormInstance } from 'element-plus'

console.log("add stock",stock)

const marketList: Ref<EastmoneyMarketEn[]> = computed(() => {
  return (stock as EastmoneyMarket[]).map(eastmoneyMarketZhToEn) as EastmoneyMarketEn[]
})

let options: { value: string, label: string }[] = [];

const dialogVisible = ref(false)

const open = ()=>{
  dialogVisible.value = true
  // 重置表单状态
  form.value.stock = ''
  formRef.value?.resetFields()
  
  options = marketList.value.map(item=>{
    return {
        value: item.code,
        label: `${item.name}(${item.code})`,
    }
  })
}

const beforeClose = ()=>{
  dialogVisible.value = false
  // 清空表单和重置验证状态
  formRef.value?.resetFields()
  form.value.stock = ''
}

const formRef = ref<FormInstance>()
const handleConfirm = ()=>{
  formRef.value?.validate((valid)=>{
    if (valid) {
      dialogVisible.value = false
      emit('confirm',form.value.stock)
    }
  })
}

const form = ref({
  stock: ''
})

const formRules = {
  stock: [
    { required: true, message: 'Please select a stock', trigger: 'blur' }
  ]
}

const emit = defineEmits(['confirm'])

defineExpose({
  open,
})
</script>