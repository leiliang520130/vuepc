<template>
    <div class="mt-[15px]">
        <div>
            <div class="flex justify-between py-[14px]">
                <div class="flex items-center">
                    <div
                        class="cursor-pointer leading-[20px] transition-transform"
                        :class="{ 'rotate-[-90deg]': !expandStatus }"
                        @click="changExpand"
                    >
                        <Icon name="el-icon-ArrowDown" size="20px"></Icon>
                    </div>
                    <div
                        class="ml-2 cursor-pointer leading-[20px]"
                        @click="addParentsChapter"
                    >
                        <Icon
                            style="margin-left: 20px"
                            name="el-icon-CirclePlusFilled"
                            size="20px"
                            color="#21b931"
                        ></Icon>
                    </div>
                    <span class="font-medium text-lg ml-2">{{
                        `第${PIndex + 1}章 ${itemData.chapter}`
                    }}</span>
                </div>
                <div class="flex items-center">
                    <div
                        class="mr-[20px] cursor-pointer"
                        @click="delItem(PIndex)"
                    >
                        <Icon
                            name="el-icon-Delete"
                            size="20px"
                            color="#ff303e"
                        ></Icon>
                    </div>
                    <div
                        class="cursor-pointer"
                        @click="EditParentsChapter(itemData.chapter)"
                    >
                        <Icon
                            name="el-icon-EditPen"
                            size="20px"
                            :color="theme.primaryColor"
                        ></Icon>
                    </div>
                </div>
            </div>
            <div
                class="max-h-[0px] overflow-hidden expandList"
                :class="{ expandMaxH: expandStatus }"
            >
                <div
                    class="flex justify-between py-[14px]"
                    :class="`secondItem-${PIndex}`"
                    v-for="(item, index) in itemData.sections"
                    :key="index"
                >
                    <div class="flex items-center">
                        <div class="cursor-pointer leading-[20px] opacity-0">
                            <Icon name="el-icon-ArrowDown" size="20px"></Icon>
                        </div>
                        <div
                            class="ml-2 cursor-pointer leading-[20px]"
                            @click="addSonTitle(index)"
                        >
                            <Icon
                                style="margin-left: 20px"
                                name="el-icon-CirclePlusFilled"
                                size="20px"
                                color="#21b931"
                            ></Icon>
                        </div>
                        <div class="ml-2">
                            <div class="font-medium text-lg">
                                {{ `${index + 1}、${item.name}` }}
                            </div>
                            <div class="text-[#666666]">
                                {{ item.abstract }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div
                            class="mr-[20px] cursor-pointer"
                            @click="delItem(PIndex, index)"
                        >
                            <Icon
                                name="el-icon-Delete"
                                size="20px"
                                color="#ff303e"
                            ></Icon>
                        </div>
                        <div
                            class="cursor-pointer"
                            @click="EditSontitle(index, item)"
                        >
                            <Icon
                                name="el-icon-EditPen"
                                size="20px"
                                :color="theme.primaryColor"
                            ></Icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <editChapter
            v-if="popShow"
            @submit="
                (value) => {
                    $emit('submit', value)
                    popShow = false
                }
            "
            @close="popShow = false"
            ref="editPopRef"
        ></editChapter>
    </div>
</template>

<script setup lang="ts">
import editChapter from './editChapter.vue'
import { useThemeStore } from '~/stores/theme'

const emits = defineEmits(['submit', 'del'])

const props = defineProps({
    itemData: {
        default: {} as any
    },
    PIndex: {
        default: -1
    }
})

const popShow = ref(false)
const editPopRef = shallowRef()

const theme = useThemeStore()

const expandStatus = ref(true)

const expandH = computed(() => {
    const dom = document.getElementsByClassName(`secondItem-${props.PIndex}`)
    let totleHeight = 0
    for (let i = 0; i < dom.length; i++) {
        totleHeight += dom[i].getClientRects()[0].height
    }
    return `${
        (totleHeight / props.itemData.sections.length) *
        props.itemData.sections.length
    }px`
})

//修改展开状态
const changExpand = () => {
    expandStatus.value = !expandStatus.value
}
//添加目录
const addParentsChapter = async () => {
    popShow.value = true
    await nextTick()
    editPopRef.value.open('addParents', { PIndex: props.PIndex })
}

//编辑目录
const EditParentsChapter = async (title: any) => {
    popShow.value = true
    await nextTick()
    editPopRef.value.open('editParents', {
        PIndex: props.PIndex,
        title
    })
}

//添加子目录
const addSonTitle = async (SIndex: number) => {
    popShow.value = true
    await nextTick()
    editPopRef.value.open('addSon', { PIndex: props.PIndex, SIndex })
}

const EditSontitle = async (SIndex: number, data: any) => {
    popShow.value = true
    await nextTick()
    editPopRef.value.open('editSon', { PIndex: props.PIndex, SIndex, ...data })
}

//删除
const delItem = async (PIndex: number, SIndex?: number) => {
    await feedback.confirm('是否确认删除改章节？章节不足会导致论文总体字数不足')
    emits('del', { PIndex, SIndex })
}
</script>

<style lang="scss" scoped>
.expandMaxH {
    max-height: v-bind(expandH);
}
.expandList {
    transition: max-height 0.3s ease-in-out;
}
</style>
