<template>
    <Popup ref="popRef" width="900px" title="相关问题">
        <div
            class="py-[20px] itemQuestion"
            v-for="(item, index) in dataList"
            :key="index"
        >
            <div class="flex items-center">
                <div
                    class="bg-primary-light-8 rounded w-[22px] text-center leading-[22px] text-primary font-medium flex-none"
                >
                    Q
                </div>
                <div class="ml-2">{{ item.q }}</div>
            </div>
            <div class="flex mt-[16px] items-start">
                <div
                    class="bg-[#FFF5E0] rounded w-[22px] text-center leading-[22px] text-[#FBAE00] font-medium flex-none"
                >
                    A
                </div>
                <div class="ml-2">{{ item.a }}</div>
            </div>
        </div>
    </Popup>
</template>

<script setup lang="ts">
import { getProblems } from '~/api/generate'

const props = defineProps({
    wid: {
        type: Number,
        default: -1
    }
})

const popRef = shallowRef()

const open = () => {
    popRef.value.open()
    refresh()
}

const { data: dataList, refresh } = useAsyncData(
    () => getProblems({ wid: props.wid }),
    {
        transform: (value) => {
            return value.lists
        },
        default: () => {
            return []
        }
    }
)

defineExpose({ open })
</script>

<style scoped lang="scss">
.itemQuestion {
    &:not(:last-child) {
        border-bottom: 1px solid #f2f2f2;
    }
}
</style>
