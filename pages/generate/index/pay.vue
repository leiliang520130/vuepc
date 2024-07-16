<template>
    <div class="main flex flex-col items-center">
        <div
            class="text-center relative w-full"
            :class="{ 'mt-[140px]': !appStore.isMobile }"
        >
            <div
                class="flex items-center absolute font-medium cursor-pointer"
                @click="toBack"
            >
                <Icon name="el-icon-ArrowLeft" size="16"></Icon>
                <span class="ml-2">返回上一页</span>
            </div>
            <span class="font-medium text-[24px]">支付订单</span>
        </div>
        <div
            :class="{
                'w-[750px]': !appStore.isMobile,
                '!w-full ': appStore.isMobile
            }"
        >
            <div class="flex relative mt-[43px]">
                <div class="titleBefore absolute"></div>
                <div class="ml-[14px] font-medium text-[16px]">订单信息</div>
            </div>
            <el-card class="!border-none mt-[20px]">
                <el-form>
                    <el-form-item label="题目：">{{
                        orderData.subject
                    }}</el-form-item>
                    <el-form-item label="类型：">{{
                        orderData.category
                    }}</el-form-item>
                    <el-form-item label="单价：">{{
                        `${orderData.write_price}/篇`
                    }}</el-form-item>
                    <el-form-item label="实付：">
                        <Price
                            color="#FF2C3C"
                            main-size="24px"
                            prefix=""
                            :content="orderData.order_amount"
                            :suffix="'元'"
                        >
                        </Price>
                    </el-form-item>
                </el-form>
            </el-card>
            <div class="flex relative mt-[43px]">
                <div class="titleBefore absolute"></div>
                <div class="ml-[14px] font-medium text-[16px]">资料清单</div>
            </div>
            <el-card class="!border-none mt-[20px]">
                <div class="flex items-center">
                    <Icon
                        name="el-icon-Document"
                        color="#3553fd"
                        size="32"
                    ></Icon>
                    <div class="ml-[5px]">
                        [范文] {{ `${orderData.subject}.doc` }}
                    </div>
                </div>
            </el-card>
            <template v-if="serverListData.length">
                <div class="flex relative mt-[43px]">
                    <div class="titleBefore absolute"></div>
                    <div class="ml-[14px] font-medium text-[16px]">
                        增值服务
                    </div>
                </div>
                <ElCheckboxGroup v-model="isSelectService">
                    <div class="mt-[20px] pb-[10px] flex flex-wrap">
                        <div
                            v-for="item in serverListData"
                            :key="item.id"
                            class="px-[24px] py-[19px] bg-white rounded-lg shadow mr-[30px] flex items-center justify-center cursor-pointer mb-2"
                            :class="{
                                isSelect: isSelectService?.includes(item.id),
                                unSelect: !isSelectService?.includes(item.id)
                            }"
                            @click="toSelectService(item.id)"
                        >
                            <el-image
                                :src="item.image"
                                class="w-[20px] h-[20px]"
                            ></el-image>
                            <div class="ml-2 text-base">{{ item.title }}</div>

                            <div class="ml-2 text-[#FF2C3C] text-base">
                                {{ item.price }}元
                            </div>
                            <el-checkbox
                                @click.stop.native="() => {}"
                                :label="item.id"
                                class="ml-[16px]"
                                >{{ '' }}</el-checkbox
                            >
                        </div>
                    </div>
                </ElCheckboxGroup>
            </template>
            <div class="flex relative mt-[43px]">
                <div class="titleBefore absolute"></div>
                <div class="ml-[14px] font-medium text-[16px]">支付方式</div>
            </div>
            <div class="mt-[20px] pb-[10px] flex">
                <div
                    v-for="item in payWayList"
                    :key="item.id"
                    class="w-[140px] bg-white rounded-lg shadow py-[16px] isSelect mr-[30px] flex items-center justify-center cursor-pointer"
                    :class="{
                        isSelect: item.pay_way == isSelectPayWay,
                        unSelect: item.pay_way != isSelectPayWay
                    }"
                    @click="selectPayWay(item.pay_way)"
                >
                    <el-image
                        :src="item.icon"
                        class="w-[20px] h-[20px]"
                    ></el-image>
                    <div class="ml-2">{{ item.name }}</div>
                </div>
            </div>
            <div class="mt-[40px]">
                <el-button
                    type="primary"
                    class="!px-[42px] !py-[18px]"
                    @click="toPay"
                    >确认支付</el-button
                >
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    ElCard,
    ElForm,
    ElFormItem,
    ElImage,
    ElButton,
    ElCheckbox,
    ElCheckboxGroup
} from 'element-plus'
import { getPayWay, prepay, getOrderData, AddedServiceList } from '~/api/pay'
import { pay } from '@/utils/pay'
import { useAppStore } from '~~/stores/app'
import { getClient } from '~~/utils/client'
import { ClientEnum } from '@/enums/appEnums'
import wechatoa from '@/utils/wechat'

const appStore = useAppStore()
const runtimeConfig = useRuntimeConfig()
//路由
const router = useRouter()
const route = useRoute()

const order_id = route.query.order_id

//已选中增值服务
const isSelectService = ref<number[]>([])

//选择服务
const toSelectService = (id: number) => {
    const index = isSelectService.value?.findIndex(
        (item) => item == id
    ) as number
    if (index == -1) {
        isSelectService.value?.push(id)
    } else {
        isSelectService.value?.splice(index, 1)
    }
}

watch(
    () => isSelectService,
    () => {
        refreshOrderData()
    },
    { deep: true }
)

const { data: orderData, refresh: refreshOrderData } = await useAsyncData(() =>
    getOrderData({ id: order_id, service_id: isSelectService.value })
)

const { data: serverListData } = await useAsyncData(() =>
    AddedServiceList({ id: order_id })
)

//已选中的支付方式
const isSelectPayWay = ref<number>()

const { data: payWayList } = await useAsyncData(() => getPayWay(), {
    transform: (value) => {
        isSelectPayWay.value = value.lists[0].pay_way
        return value.lists
    }
})

//选择支付方式
const selectPayWay = (value: number) => {
    isSelectPayWay.value = value
}

//支付
const toPay = async () => {
    if (
        getClient() == ClientEnum.WEIXIN_OA &&
        wechatoa.getAuthData().code == ''
    ) {
        await wechatoa.getUrl()
    } else {
        try {
            const payData = await prepay({
                from: 'order',
                pay_way: isSelectPayWay.value,
                order_id,
                terminal: getClient(),
                redirect: `${runtimeConfig.app.baseURL}generate/record`,
                code: wechatoa.getAuthData().code
            })
            await pay.run({
                payWay: payData.pay_way,
                orderId: order_id,
                from: 'order',
                config: payData.config
            })
            router.push({
                path: '/generate/record'
            })
        } catch (error) {
            console.log(error)
            wechatoa.setAuthData()
        }
    }
}

const toBack = async () => {
    await feedback.confirm('返回上一页会导致已填写信息丢失，是否继续跳转？')
    router.back()
}

onMounted(() => {
    if (wechatoa.getAuthData().code) {
        toPay()
    }
})
</script>

<style scoped lang="scss">
.titleBefore {
    width: 4px;
    height: 100%;
    background: var(--el-color-primary);
}

.isSelect {
    border: 2px solid var(--el-color-primary);
}

.unSelect {
    border: 2px solid #e6e9ed;
}
</style>
