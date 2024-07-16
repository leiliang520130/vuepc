<template>
    <!-- <ElInput v-bind="props" v-model="value" /> -->
    <div class="shadow bg-white p-[8px] rounded w-full">
        <el-input v-bind="props" v-model="value" show-word-limit></el-input>
    </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { InputProps } from 'element-plus'
interface Props extends Partial<InputProps> {}
const props = withDefaults(defineProps<Props>(), {
    showWordLimit: true,
    maxlength: '100'
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: any): void
}>()
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
const maxLen = useAttrs().maxlength
console.log(useAttrs())

// const maxLen = useAttrs().value.maxlength
</script>
<style lang="scss" scoped>
:deep(.el-input) {
    border: none !important;
    .el-input__wrapper {
        box-shadow: none !important;
    }
}
:deep(.el-checkbox__label) {
    display: inline-grid;
    white-space: pre-line;
    word-wrap: normal;
    line-height: 20px;
}
</style>
