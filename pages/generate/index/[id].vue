<template>
    <div
        class="main flex flex-col items-center"
        :class="{ 'pb-[50px]': appStore.isMobile }"
    >
        <el-image
            v-if="detailData.banner != ''"
            :src="detailData.banner"
            class="w-full h-[120px]"
        ></el-image>
        <div
            class="mt-[30px]"
            :class="{
                'w-[750px]': !appStore.isMobile,
                'w-full': appStore.isMobile
            }"
        >
            <div class="flex justify-center w-full">
                <carousel></carousel>
            </div>
            <div class="text-[30px] font-medium text-center py-[50px]">
                {{ detailData.title }}
            </div>
            <div>
                <FormDesigner
                    v-if="!detailDataLoading"
                    ref="formDesignerRef"
                    v-model="formData"
                    :form-lists="detailData.forms"
                    size="large"
                />
            </div>
            <div v-if="tipsData?.content != ''">
                <el-checkbox
                    :true-label="1"
                    :false-label="0"
                    v-model="statement"
                    >{{ tipsData?.content }}
                </el-checkbox>
            </div>

            <div class="mt-[50px] flex justify-center" id="generating">
                <el-button
                    :disabled="generateStatus == 1"
                    type="primary"
                    @click="generateOutline"
                    class="bg-gradient-to-r from-minor to-primary text-white !px-[58px] !py-[20px] !rounded-lg PrimaryBtnColor !border-none"
                    >{{
                        detailData.outline_status == 0 ? '生成全文' : '生成大纲'
                    }}</el-button
                >
            </div>
            <div
                class="text-xl font-semibold mt-[30px] text-center"
                v-if="generateStatus != 0"
            >
                题目：{{ formData?.title }}
            </div>
            <div
                class="flex justify-center mt-[30px] pb-[300px]"
                v-if="generateStatus == 1"
            >
                <el-progress
                    type="dashboard"
                    :percentage="progress"
                    :color="theme.primaryColor"
                >
                    <template #default="{ percentage }">
                        <div class="flex flex-col items-center justify-center">
                            <div>
                                <span class="font-medium text-[30px]">{{
                                    percentage
                                }}</span
                                >%
                            </div>
                            <div class="mt-2">生成中...</div>
                        </div>
                    </template>
                </el-progress>
            </div>
            <div v-if="generateStatus == 2" id="outlines">
                <outline
                    v-for="(item, index) in outlineData.outlines"
                    :key="index"
                    :item-data="item"
                    :PIndex="index"
                    @submit="outlineUpdate"
                    @del="outlineDel"
                ></outline>
                <div class="mt-[50px] flex justify-center">
                    <el-button
                        type="primary"
                        @click="generateFullText"
                        class="bg-gradient-to-r from-minor to-primary text-white !px-[58px] !py-[20px] !rounded-lg !border-none"
                        >生成全文</el-button
                    >
                </div>
            </div>
            <div class="mt-[100px]" v-if="detailData.problem.length">
                <!-- <el-card class="!border-none" shadow="never"> -->
                <div class="bg-[#f6f6f6] p-[15px] rounded-lg">
                    <div class="font-medium text-lg">相关问题</div>
                    <div class="grid grid-cols-2 gap-3 mt-[15px]">
                        <div
                            class="text-[#666666] cursor-pointer hover:text-primary"
                            v-for="(item, index) in detailData.problem"
                            :key="index"
                            @click="showQPop"
                        >
                            Q:{{ item.q }}
                        </div>
                    </div>
                </div>
                <!-- </el-card> -->
            </div>
        </div>
        <questionPop :wid="currentId" ref="questionPopRef"></questionPop>
    </div>
</template>

<script setup lang="ts">
import { ElImage, ElCheckbox, ElButton, ElProgress } from 'element-plus'
import carousel from '../_components/carousel.vue'
import outline from '../_components/outline.vue'
import questionPop from '../_components/questionPop.vue'
import {
    getWriteDetail,
    getTipsContent,
    generate,
    generateOrder
} from '~/api/generate'
import FakeProgress from 'fake-progress'
import { useThemeStore } from '~/stores/theme'
import { useAppStore } from '~~/stores/app'
import { Scroll } from '../_hook/scroll'

const theme = useThemeStore()
const appStore = useAppStore()

const route = useRoute()
const router = useRouter()

//相关问题弹框
const questionPopRef = shallowRef()

const formDesignerRef = shallowRef()
const formData: any = ref({})
//进度条
const progress = ref<any>('0')
//生成状态 0-生成完成 1-生成中 2-生成成功
const generateStatus = ref(0)
//免责声明
const statement = ref(true)

//获取详情数据
const {
    data: detailData,
    refresh: getDetail,
    pending: detailDataLoading
} = useAsyncData(() => getWriteDetail({ id: currentId.value }), {
    transform: (value) => {
        console.log(value)

        return value
    },
    default: () => {
        return {
            forms: [],
            id: 0,
            intro: '',
            problem: [],
            title: ''
        }
    }
})

//选中分类
const currentId = ref<any>()
watch(
    () => route.params.id,
    (value) => {
        if (value) {
            currentId.value = value
            getDetail()
        }
    },
    {
        immediate: true
    }
)

//获取提示数据
const { data: tipsData } = useAsyncData(() =>
    getTipsContent({ type: 'disclaimer' })
)

const p = new FakeProgress({
    timeConstant: 10000,
    autoStart: false
})
const outlineData: any = ref({})
//生成大纲
const generateOutline = async () => {
    if (!statement.value && !!tipsData.value.content) {
        feedback.msgError('请阅读并同意免责声明')
        return
    }
    if (detailData.value.outline_status == 0) {
        await formDesignerRef.value?.validate()
        outlineData.value = await generate({
            write_id: currentId.value,
            forms: formData.value
        })
        generateFullText()
        return
    }
    generateStatus.value = 1
    p.start()
    const interval = setInterval(onEachSecond, 1000)
    scrollElement('generating')
    try {
        await formDesignerRef.value?.validate()
        outlineData.value = await generate({
            write_id: currentId.value,
            forms: formData.value
        })
        generateStatus.value = 2
        await nextTick()
        scrollElement('outlines')
    } catch (error) {
        generateStatus.value = 0
    }

    p.end()
    progress.value = p.progress
    clearInterval(interval)
}
//更新进度条
const onEachSecond = function () {
    progress.value = (p.progress * 100).toFixed(0)
}

//滚动元素
const scrollElement = async (id: string) => {
    const dom = document.getElementById(id) as HTMLElement
    const { top } = dom.getClientRects()[0]
    await nextTick()
    Scroll(top)
}

//获取目录更新
const outlineUpdate = (value: any) => {
    console.log(value)
    if (value.type == 'addParents') {
        outlineData.value.outlines.splice(
            value.position == 'after' ? value.PIndex + 1 : value.PIndex,
            0,
            {
                chapter: value.title,
                sections: [
                    {
                        name: '请修改标题',
                        abstract: '请修改概要'
                    }
                ]
            }
        )
    } else if (value.type == 'editParents') {
        outlineData.value.outlines[value.PIndex].chapter = value.title
    } else if (value.type == 'addSon') {
        outlineData.value.outlines[value.PIndex].sections.splice(
            value.position == 'after' ? value.SIndex + 1 : value.SIndex,
            0,
            { name: value.title, abstract: value.summary }
        )
    } else if (value.type == 'editSon') {
        ;[
            outlineData.value.outlines[value.PIndex].sections[value.SIndex]
                .name,
            outlineData.value.outlines[value.PIndex].sections[value.SIndex]
                .abstract
        ] = [value.title, value.summary]
    }
}

//大纲删除
const outlineDel = (index: any) => {
    if (index.SIndex == undefined) {
        outlineData.value.outlines.splice(index.PIndex, 1)
    } else {
        outlineData.value.outlines[index.PIndex].sections.splice(
            index.SIndex,
            1
        )
    }
}

//生成全文
const generateFullText = async () => {
    const { order_id } = await generateOrder({
        ...outlineData.value,
        terminal: getClient()
    })
    router.push({
        path: '/generate/pay',
        query: {
            order_id
        }
    })
}

//弹出相关问题弹框
const showQPop = () => {
    questionPopRef.value.open()
}
</script>

<style scoped lang="scss">
// :deep(.el-input) {
//     border: none !important;
//     .el-input__wrapper {
//         box-shadow: none !important;
//     }
// }
:deep(.el-checkbox__label) {
    display: inline-grid;
    white-space: pre-line;
    word-wrap: normal;
    line-height: 20px;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #666666;
}
</style>
