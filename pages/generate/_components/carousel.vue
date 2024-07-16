<template>
    <div class="carousel w-full" v-if="appStore.config.is_horse_lamp == 1">
        <template v-if="generateList.length && type == 'generate'">
            <el-carousel
                height="40px"
                direction="vertical"
                :autoplay="true"
                indicator-position="none"
            >
                <el-carousel-item
                    v-for="(item, index) in generateList"
                    :key="index"
                >
                    <div class="flex items-center justify-center h-full">
                        <Icon
                            name="el-icon-BellFilled"
                            size="16"
                            :color="theme.primaryColor"
                        ></Icon>
                        <div
                            class="ml-2 text-[#888888] text-[13px] text-center"
                        >
                            {{ item }}
                        </div>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </template>
        <template v-if="rechargeList.length > 0 && type == 'recharge'">
            <el-carousel
                height="40px"
                direction="vertical"
                :autoplay="true"
                indicator-position="none"
            >
                <el-carousel-item
                    v-for="(item, index) in rechargeList"
                    :key="index"
                >
                    <div class="flex items-center justify-center h-full">
                        <Icon
                            name="el-icon-BellFilled"
                            size="16"
                            :color="theme.primaryColor"
                        ></Icon>
                        <div
                            class="ml-2 text-[#888888] text-[13px] text-center"
                        >
                            {{ item }}
                        </div>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ElCarousel, ElCarouselItem } from 'element-plus'
import { useThemeStore } from '~/stores/theme'
import { getNotice } from '~/api/generate'
import { useAppStore } from '~~/stores/app'
import { getRechargeNotice } from '@/api/pay'

const prop = defineProps({
    type: {
        type: String,
        default: 'generate'
    }
})

const theme = useThemeStore()
const appStore = useAppStore()

const { data: generateList } = await useAsyncData(() => getNotice())
const { data: rechargeList } = await useAsyncData(() => getRechargeNotice())
</script>

<style lang="scss" scoped>
.carousel {
    max-width: 600px;
    height: 40px;
    background: linear-gradient(
        90deg,
        #ffb70000 0%,
        #ffb7003d 51.72%,
        #ffb70000 100%
    );
}
</style>
