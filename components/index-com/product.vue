<template>
    <div>
        <template v-if="!appStore.isMobile">
            <div
                class="product_content pt-[20px] px-[20px]"
                v-if="decorateData.content.enabled == 1"
            >
                <template
                    v-for="(item, index) in decorateData.content.data.filter(
                        (item) => item.display == '1'
                    )"
                    :key="index"
                >
                    <div
                        class="flex items-center justify-between"
                        v-if="item.display == '1' && index % 2 == 0"
                    >
                        <div
                            class="flex-none mr-[20px]"
                            :class="{ 'w-[580px]': !appStore.isMobile }"
                        >
                            <div class="text-[22px] font-medium">
                                {{ item.title }}
                            </div>
                            <div class="text-[14px] mt-[10px]">
                                {{ item.subtitle }}
                            </div>
                            <div class="mt-[30px] flex items-start">
                                <Icon
                                    size="16px"
                                    name="el-icon-SuccessFilled"
                                    :color="themeStore.primaryColor"
                                ></Icon>
                                <div class="ml-2">{{ item.describe }}</div>
                            </div>
                            <div class="mt-[20px]">
                                <el-button
                                    type="primary"
                                    link
                                    @click="toGenerate()"
                                    ><span class="font-bold">
                                        去使用 >
                                    </span></el-button
                                >
                            </div>
                        </div>
                        <div>
                            <el-image
                                class="rounded"
                                :src="appStore.getImageUrl(item.image)"
                            ></el-image>
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between"
                        v-if="item.display == '1' && index % 2 == 1"
                    >
                        <div class="">
                            <el-image
                                class="rounded"
                                :src="appStore.getImageUrl(item.image)"
                            ></el-image>
                        </div>
                        <div
                            class="flex-none ml-[20px]"
                            :class="{ 'w-[580px]': !appStore.isMobile }"
                        >
                            <div class="text-[22px] font-medium">
                                {{ item.title }}
                            </div>
                            <div class="text-[14px] mt-[10px]">
                                {{ item.subtitle }}
                            </div>
                            <div class="mt-[30px] flex items-start">
                                <Icon
                                    size="16px"
                                    name="el-icon-SuccessFilled"
                                    :color="themeStore.primaryColor"
                                ></Icon>
                                <div class="ml-2">{{ item.describe }}</div>
                            </div>
                            <div class="mt-[20px]">
                                <el-button
                                    type="primary"
                                    link
                                    @click="toGenerate()"
                                >
                                    <span class="font-bold"> 去使用 > </span>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
        <template v-if="appStore.isMobile">
            <div
                class="px-[30px] mt-[20px]"
                v-for="(item, index) in decorateData.content.data.filter(
                    (item) => item.display == '1'
                )"
                :key="index"
                @click="toGenerate()"
            >
                <div class="bg-page rounded-lg overflow-hidden">
                    <el-image
                        class="w-full"
                        :src="appStore.getImageUrl(item.image)"
                    ></el-image>

                    <div class="px-[30px] py-[20px]">
                        <div class="text-[22px] font-medium">
                            {{ item.title }}
                        </div>
                        <div class="text-[14px] mt-[10px]">
                            {{ item.subtitle }}
                        </div>
                        <div class="mt-[30px] flex">
                            <Icon
                                size="16px"
                                name="el-icon-SuccessFilled"
                                :color="themeStore.primaryColor"
                            ></Icon>
                            <div class="ml-2">{{ item.describe }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ElImage, ElButton } from 'element-plus'
import { useAppStore } from '~~/stores/app'
import { useThemeStore } from '~/stores/theme'

const appStore = useAppStore()
const themeStore = useThemeStore()

const emits = defineEmits(['toGenerate'])

const props = defineProps({
    decorateData: {
        default: {} as any
    }
})

//跳转至生成页面
const toGenerate = () => {
    emits('toGenerate')
}
</script>
