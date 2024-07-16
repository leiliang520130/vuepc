<template>
    <div class="locality-draw-popup">
        <ElDialog
            v-model="visible"
            width="980px"
            class="!rounded-[0px]"
            :center="true"
            :draggable="true"
            :destroy-on-close="true"
            :close-on-click-modal="false"
            @close="unmounted"
        >
            <template #header>
                <div class="w-full text-left">
                    <div class="text-base font-medium">{{ title }}</div>
                    <div class="text-xs text-tx-secondary">局部重绘</div>
                </div>
            </template>
            <div class="flex justify-center">
                <div class="w-[940px] h-[500px]">
                    <!--  图片区域  -->
                    <canvas
                        id="locality-canvas"
                        width="940"
                        height="500"
                        @mousedown="drawTouStart"
                        @mousemove="drawTouMove"
                        @mouseup="drawTouEnd"
                        @mouseleave="drawTouEnd"
                    ></canvas>
                </div>
            </div>
            <div class="dialog-footer flex items-center mt-6 mb-4 px-10">
                <el-tooltip effect="dark" content="矩形工具" placement="top">
                    <div
                        class="flex justify-center items-center w-[43px] h-[43px] bg-page rounded-full mr-2 hover:bg-primary"
                        @click="changeTool('rect')"
                    >
                        <Icon name="local-icon-rect" size="24" />
                    </div>
                </el-tooltip>

                <el-tooltip effect="dark" content="套索工具" placement="top">
                    <div
                        class="flex justify-center items-center w-[43px] h-[43px] bg-page rounded-full mr-2 hover:bg-primary"
                        @click="changeTool('lasso')"
                    >
                        <Icon name="local-icon-lasso" size="24" />
                    </div>
                </el-tooltip>

                <el-tooltip effect="dark" content="返回上一步" placement="top">
                    <div
                        class="flex justify-center items-center w-[43px] h-[43px] bg-page rounded-full mr-2 hover:bg-primary"
                        @click="undoHandler"
                    >
                        <Icon name="local-icon-back" size="24" />
                    </div>
                </el-tooltip>

                <div class="flex flex-1 items-center">
                    <div
                        class="flex h-full items-end flex-1 rounded-sm overflow-hidden"
                    >
                        <div
                            class="flex items-center w-full min-h-full px-[6px] bg-page rounded-full"
                        >
                            <ElInput
                                v-model="inputContent"
                                :input-style="{
                                    'border-radius': '50px',
                                    backgroundColor: 'var(--el-bg-color-page)'
                                }"
                                class="min-h-full py-[6px]"
                                placeholder="请输入内容（Shift + Enter）= 换行"
                                type="textarea"
                                :autosize="{
                                    maxRows: 3
                                }"
                                resize="none"
                            />
                            <el-button
                                :loading="isLock"
                                type="primary"
                                :icon="Promotion"
                                :circle="true"
                                @click="captureCombinedSelections"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ElDialog>
    </div>
</template>

<script lang="ts" setup>
import { useLockFn } from '@/composables/useLockFn'
import { useImageEditor } from '../../hooks/useLcalitySplit'
import { ElButton, ElInput, ElDialog } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'

const {
    initCanvas,
    changeTool,

    drawTouStart,
    drawTouMove,
    drawTouEnd,

    captureCombinedSelections,
    undoHandler,
    unmounted
} = useImageEditor({
    ondata(result: string) {
        clippedResult.value = result
        console.log(result)
    }
})

const emit = defineEmits(['success', 'close'])
withDefaults(
    defineProps<{
        title?: string
    }>(),
    {
        title: ''
    }
)

// 是否弹窗
const visible = ref<boolean>(false)
// 重绘输入内容
const inputContent = ref<string>('')
// 重绘裁剪结果
const clippedResult = ref<string>('')

//提交
const { lockFn: contentPost, isLock } = useLockFn(async () => {
    visible.value = false
    emit('success')
})

const handleClose = () => {
    emit('close')
}

const open = async (draw: any) => {
    visible.value = true
    await nextTick()
    initCanvas('locality-canvas', draw.image_url)
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-textarea__inner) {
    box-shadow: none;
    background-color: var(--el-bg-color-page);
}
</style>
