<template>
    <div class="index">
        <NuxtLayout name="default">
            <template #Title>
                <div
                    class="title_content pt-[80px] pb-[20px] text-center mx-[20px] md:mx-0"
                    :style="{
                        'background-image': `url(${appStore.getImageUrl(
                            decorateData[0].content.bgImg
                        )})`,
                        'background-size': 'cover',
                        'background-position': 'center'
                    }"
                >
                    <div
                        class="font-bold text-[34px] text-[#101010]"
                        style="font-family: 'Source Han Sans CN Bold'"
                    >
                        {{ decorateData[0].content.title }}
                    </div>
                    <div class="font-bold mt-[24px] text-[18px]">
                        {{ decorateData[0].content.content }}
                    </div>
                    <div class="mt-[40px] flex justify-center">
                        <el-button
                            type="primary"
                            class="bg-gradient-to-r from-minor to-primary !px-[28px] !py-[20px] !rounded-lg PrimaryBtnColor !border-none"
                            @click="toGenerate()"
                            >立即前往体验</el-button
                        >
                    </div>
                </div>
            </template>

            <div
                class="type_content h-[420px] mt-[30px]"
                v-if="decorateData[1].content.display == 1"
            >
                <el-carousel height="390px" indicator-position="none">
                    <el-carousel-item
                        v-for="(item, index) in typeData"
                        :key="index"
                    >
                        <div
                            class="grid gap-4 p-[20px] cursor-pointer"
                            :class="{
                                'grid-cols-5': !appStore.isMobile,
                                'grid-cols-2': appStore.isMobile
                            }"
                        >
                            <div
                                v-for="(item1, index1) in item"
                                :key="index1"
                                class="item_type p-[20px] bg-white rounded-lg shadow"
                                @click="toGenerate(item1.id)"
                            >
                                <div class="flex items-center">
                                    <el-image
                                        :src="item1.image"
                                        class="h-[34px] w-[34px] rounded-full flex-none"
                                    ></el-image>
                                    <div class="ml-2 truncate">
                                        {{ item1.title }}
                                    </div>
                                </div>
                                <div
                                    class="mt-[10px] text-[#666666] text-[14px] line-clamp-2 h-[42px]"
                                >
                                    {{ item1.intro }}
                                </div>
                                <div class="mt-[16px] flex justify-between">
                                    <div class="text-[#999999] text-[12px]">
                                        最近生成 {{ item1.gen_count || 0 }} 次
                                    </div>
                                    <div class="gotoIcon opacity-0">
                                        <Icon
                                            name="el-icon-Right"
                                            size="16px"
                                            :color="themeStore.primaryColor"
                                        ></Icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <productCom
                :decorate-data="decorateData[2]"
                @to-generate="toGenerate()"
            ></productCom>

            <template #guide>
                <div
                    class="guide h-[250px] flex flex-col items-center justify-center w-full mt-[80px]"
                    :style="{
                        'background-image': `url(
                            ${
                                appStore.getImageUrl(
                                    decorateData[3].content.setUp.bgImage
                                ) || ''
                            }
                        )`,
                        'background-position': 'center'
                    }"
                    v-if="decorateData[3].content.enabled == 1"
                >
                    <div class="text-[24px] font-bold">
                        {{ decorateData[3].content.setUp.content }}
                    </div>
                    <el-button
                        class="mt-[30px] bg-gradient-to-r from-minor to-primary text-white !px-[28px] !py-[20px] !rounded-lg !border-none"
                        type="primary"
                        @click="toGenerate()"
                        >立即前往体验</el-button
                    >
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>
<script lang="ts" setup>
import { ElCarousel, ElCarouselItem, ElImage, ElButton } from 'element-plus'
import { getIndex } from '@/api/shop'
import { useAppStore } from '~~/stores/app'
import { getdecorate } from '~/api'
import { useThemeStore } from '~/stores/theme'
import productCom from '@/components/index-com/product.vue'
import { useUserStore } from '@/stores/user'
const appStore = useAppStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

const router = useRouter()
const route = useRoute()

const { data: decorateData } = await useAsyncData(
    () =>
        getdecorate({
            id: 2
        }),
    {
        transform: (value) => {
            return JSON.parse(value.data)
        }
    }
)

const { data: typeData } = await useAsyncData(() => getIndex(), {
    transform: (value) => {
        const pageNum = appStore.isMobile ? 4 : 10
        const arr = new Array(Math.ceil(value.writeCategory.length / pageNum))
        for (let i = 0; i < arr.length; i++) {
            if (value.writeCategory.length) {
                arr[i] = (value.writeCategory as []).splice(0, pageNum)
            }
        }
        console.log(arr)

        return arr
    }
})

//跳转至生成页面
const toGenerate = (id?: number) => {
    if (id) {
        router.push({
            path: `/generate/${id}`
        })
    } else {
        router.push({
            path: `/generate/${typeData.value[0][0].id}`
        })
    }
}

onMounted(async () => {
    // if (route.query.cid || route.query.user_sn) {
    //     const user_sn: any = useCookie('user_sn')
    //     user_sn.value = route.query.user_sn
    //     console.log(user_sn.value)
    //     await nextTick()
    //     userStore.checkShare()
    // }
})

definePageMeta({
    layout: false
})
</script>
<style lang="scss" scoped>
.item_type {
    transition: all 0.3s linear;
    .gotoIcon {
        transition: all 0.3s linear;
    }
    &:hover {
        transform: translateY(-10px);
        .gotoIcon {
            opacity: 1;
        }
    }
}
</style>
