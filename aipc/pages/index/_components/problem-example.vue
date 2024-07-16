<template>
    <div class="pb-[20px]">
        <div class="flex">
            <div
                v-for="item in sliceData"
                :key="item.id"
                class="flex-1 mx-[10px]"
            >
                <div
                    class="flex flex-col justify-center items-center mb-[20px]"
                >
                    <img
                        v-if="item.image"
                        class="w-[58px] h-[58px]"
                        :src="item.image"
                        alt=""
                    />
                    <div class="text-[16px] font-medium mt-[16px]">
                        {{ item.name }}
                    </div>
                </div>
                <div>
                    <div
                        v-for="sample in slice3InData(item.sample)"
                        :key="sample.id"
                        class="sample-item mb-[20px] p-[10px] flex justify-center cursor-pointer"
                        @click="clickItem(sample.content)"
                    >
                        <div class="line-clamp-2">
                            {{ sample.content }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center" v-if="isShowMore">
            <Popup
                ref="popupRef"
                title="问题示例"
                width="700"
                confirmButtonText=""
                cancelButtonText=""
            >
                <template #trigger>
                    <el-button link>
                        查看更多
                        <Icon name="el-icon-ArrowRight" />
                    </el-button>
                </template>
                <div class="">
                    <el-tabs v-model="currentTab">
                        <el-tab-pane
                            v-for="(item, index) in exampleList"
                            :label="item.name"
                            :name="index"
                            :key="item.id"
                        >
                            <div class="h-[300px]">
                                <el-scrollbar>
                                    <div>
                                        <template v-if="item.sample">
                                            <div
                                                v-for="sample in item.sample"
                                                :key="sample.id"
                                                class="sample-item mb-[20px] p-[10px] flex justify-center cursor-pointer"
                                                @click="
                                                    clickItem(sample.content)
                                                "
                                            >
                                                <div class="line-clamp-2">
                                                    {{ sample.content }}
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="py-[150rpx]">
                                                <u-empty
                                                    text="暂无数据"
                                                    mode="data"
                                                ></u-empty>
                                            </div>
                                        </template>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </Popup>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { samplesLists } from '@/api/chat'

const emit = defineEmits<{
    (event: 'click-item', value: string): void
}>()
//问题示例列表
const { data: exampleList } = await useAsyncData(() =>
    samplesLists({ type: 1 })
)
const currentTab = ref(0)
const num = 3
const slice3InData = (data: any[]) => {
    return data.slice(0, num)
}
const popupRef = shallowRef()
const sliceData = computed(() => {
    return slice3InData(exampleList.value || [])
})

const isShowMore = computed(() => {
    if (exampleList.value?.length > num) {
        return true
    }
    if (exampleList.value?.some((item) => item.sample.length > num)) {
        return true
    }
    return false
})

const clickItem = (value: string) => {
    popupRef.value?.close()
    emit('click-item', value)
}
</script>
<style lang="scss" scoped>
.item {
    :hover {
        color: #fb9a3b;
    }
}
.sample-item {
    border-radius: 12px;
    background: #fff;
    border: 1px solid #eef2f2;
    box-shadow: 0 2px 8px #f5f6f8;
}
</style>
