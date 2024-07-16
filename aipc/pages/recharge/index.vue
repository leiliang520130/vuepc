<template>
    <div>
        <NuxtLayout name="default">
            <ElScrollbar class="!rounded-[12px] bg-white">
                <div v-if="taskData?.content?.length" class="p-4">
                    <span class="font-bold text-2xl">
                        <span class="mr-[8px]">
                            {{ taskData.title }}
                        </span>
                        <span class="text-[#999] font-normal text-sm">
                            {{ taskData.subTitle }}
                        </span>
                    </span>
                    <div class="grid grid-cols-2 gap-4 mt-[23px]">
                        <div
                            class="bg-[#F8F8F8] p-[20px] flex rounded-md"
                            v-for="(item, index) in taskData.content"
                            :key="index"
                        >
                            <img
                                v-if="item.image"
                                class="w-[50px] h-[50px] mr-[10px]"
                                :src="appStore.getImageUrl(item.image)"
                                alt=""
                            />
                            <div class="flex-1">
                                <div class="text-lg font-medium">
                                    {{ item?.customName || item.name }}
                                    ({{ item.num }}/{{ item.max }})
                                </div>
                                <div
                                    class="mt-[10px] text-xs text-muted text-justify"
                                >
                                    <span>{{ getActionText(item.type) }}</span>
                                    <template v-if="item.rewards">
                                        <span class="text-error">{{ item.rewards }}</span>条对话</template>
                                    <template v-if="item.rewards && item.draw_rewards">,&nbsp;</template>
                                    <template v-if="item.draw_rewards">
                                        <span class="text-error">{{ item.draw_rewards }}</span>条绘画
                                    </template>
                                </div>
                            </div>
                            <el-button
                                v-if="item.type === 1"
                                :round="true"
                                :type="compare(item.num, item.max) ? 'info' : 'primary'"
                                class="self-center"
                                :disabled="compare(item.num, item.max)"
                                @click="handleClickSign"
                            >
                                {{ compare(item.num, item.max) ? '已签到' : '立即签到' }}
                            </el-button>
                            <NuxtLink
                                class="self-center"
                                v-else-if="item.type == 4"
                                to="/app/drawing"
                            >
                                <el-button type="primary" :round="true">
                                    去分享
                                </el-button>
                            </NuxtLink>
                            <el-button
                                v-else
                                :round="true"
                                type="primary"
                                class="self-center"
                                @click="getShareLink"
                            >
                                点击复制
                            </el-button>
                        </div>
                        <div
                            class="bg-[#F8F8F8] p-[20px] flex rounded-md min-h-[120px] justify-center items-center text-tx-regular"
                        >
                            敬请期待
                        </div>
                    </div>
                </div>
            </ElScrollbar>
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
import { ElScrollbar, ElButton } from 'element-plus'
import { getTaskMsg, toShare, signClick } from '@/api/recharge'
import { getdecorate } from '~/api'
import { useAppStore } from '@/stores/app'
import { useCopy } from '~/composables/useCopy'

const appStore = useAppStore()
//任务数据
const taskData = ref<any>({
    title: '',
    subTitle: '',
    content: [],
    originalContent: []
})

const compare = computed(() => {
    return (num: number, max: number) => num >= max
})

const getActionText = computed(() => {
    return (type: number) => {
        switch (type) {
            case 1:
                return '获得'
            case 2:
                return '邀请1人, 获得'
            case 3:
            case 4:
                return '分享1次, 获得'
        }
    }
})

const handleClickSign = async () => {
    try {
        await signClick()
        await getTaskData()
        await getDecorateData()
    } catch (e) {
        console.log(e)
    }
}

//获取任务数据
const getTaskData = async () => {
    taskData.value.originalContent = await getTaskMsg()
}

//获取任务装修数据
const getDecorateData = async () => {
    // 将任务数据合并给装修数据中
    const res = await getdecorate({ id: 10 })
    const parseData: any = JSON.parse(res.data)[0].content
    const objMap: any = {}
    const assembly: any = []
    for (const obj of taskData.value.originalContent) {
        delete obj.image
        objMap[obj.type] = obj
    }
    for (const obj of parseData?.data.filter((item: any) => item.show)) {
        if (obj.type in objMap) {
            assembly.push({ ...obj, ...objMap[obj.type] })
        }
    }
    console.log(assembly)
    taskData.value.originalContent = []
    taskData.value.content = assembly
    taskData.value.title = parseData.title
    taskData.value.subTitle = parseData.subTitle
}

const { copy } = useCopy()
//获取分享链接
const getShareLink = async () => {
    const { share_id } = await toShare({ channel: 4 })
    copy(`${window.origin}/?cid=${share_id}&share_id=${share_id}`)
    await getTaskData()
    await getDecorateData()
}

await useAsyncData(() => getTaskData())
await useAsyncData(() => getDecorateData())

definePageMeta({
    auth: true,
    layout: false
})
</script>
<style lang="scss" scoped></style>
