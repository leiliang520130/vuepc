<template>
    <el-popover
        v-if="decorateData.display == '1'"
        placement="right"
        width="auto"
        trigger="hover"
    >
        <template #reference>
            <div
                class="bg-white top-[60%] right-[5px] fixed z-50 shadow rounded-lg w-[60px] h-[80px] cursor-pointer"
            >
                <div
                    class="flex flex-col items-center justify-center min-w-0 h-full px-[5px]"
                >
                    <el-image
                        :src="getImageUrl(decorateData.icon1)"
                        class="w-[30px] h-[30px] flex-none"
                    ></el-image>
                    <div class="mt-2 truncate w-full text-center">
                        {{ decorateData.title }}
                    </div>
                </div>
            </div>
        </template>
        <div class="flex flex-col items-center justify-between">
            <el-image
                class="w-[100px]"
                :src="getCustomer.qr_code.value"
            ></el-image>
            <div v-if="getCustomer.title.status == '1'" class="mt-2 font-bold">
                {{ getCustomer.title.value }}
            </div>
            <div v-if="getCustomer.service_time.status == '1'" class="mt-2">
                服务时间：{{ getCustomer.service_time.value }}
            </div>
            <div v-if="getCustomer.phone.status == '1'" class="mt-2">
                联系电话:{{ getCustomer.phone.value }}
            </div>
        </div>
    </el-popover>
</template>

<script setup lang="ts">
import { ElImage, ElPopover } from 'element-plus'
import { useAppStore } from '~~/stores/app'
import { getdecorate } from '~/api'

const { getCustomer, getImageUrl } = useAppStore()

const { data: decorateData } = await useAsyncData(
    () =>
        getdecorate({
            id: 3
        }),
    {
        transform: (value) => {
            return JSON.parse(value.data)[0].content
        }
    }
)
</script>

<style scoped lang="scss"></style>
