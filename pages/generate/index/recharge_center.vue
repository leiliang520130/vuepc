<template>
    <div class="flex justify-center w-full">
        <el-card
            v-if="appStore.rechargeConfig.status == 1"
            :class="{ ' w-[1200px]': !isMobile }"
            class="py-[30px] flex flex-col items-center"
        >
            <div class="text-center font-bold text-[30px]">充值中心</div>
            <div class="flex justify-center mt-[40px]">
                <carousel type="recharge"></carousel>
            </div>
            <div :class="{ ' w-[860px]': !isMobile }">
                <div
                    class="mt-[70px] grid"
                    :class="{
                        'grid-cols-4 gap-4': !isMobile,
                        'grid-cols-1 gap-5 px-[20px]': isMobile
                    }"
                >
                    <div
                        v-for="item in templateList"
                        :key="item.id"
                        class="rounded-lg text-center cursor-pointer relative"
                        :class="{
                            isSelect: item.id == isSelectTemplate,
                            noSelect: item.id != isSelectTemplate,
                            '  py-[33px] px-[50px]': !isMobile
                        }"
                        @click="selectTemplate(item.id)"
                    >
                        <div>
                            <span class="text-[20px] font-bold">￥</span>
                            <span class="text-[28px] font-bold">{{
                                item.money
                            }}</span>
                        </div>
                        <div class="text-xs text-info mt-2">
                            余额增加：{{ item.get_money }}
                        </div>
                        <div
                            v-if="item.award != 0.0"
                            class="absolute top-[-20px] left-0 rounded-tl-lg rounded-br-lg bg-[#FF0000] text-white p-[5px]"
                        >
                            额外赠送{{ item.award }}元
                        </div>
                    </div>
                    <div
                        class="h-full w-full rounded-lg px-[30px] py-[54px]"
                        @click="selectTemplate(-1)"
                        :class="{
                            isSelect: isSelectTemplate == -1,
                            noSelect: isSelectTemplate != -1
                        }"
                    >
                        <div class="flex items-center">
                            <span class="text-[20px] font-bold">￥</span>
                            <el-input
                                placeholder="自定义金额"
                                v-model="money"
                            ></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-[40px]">
                <div class="font-bold">支付方式：</div>
                <div class="mt-[20px] pb-[10px]" :class="{ flex: !isMobile }">
                    <div
                        v-for="item in payWayList"
                        :key="item.id"
                        class="w-[140px] bg-white rounded-lg shadow py-[16px] mr-[30px] flex items-center justify-center cursor-pointer"
                        :class="{
                            isSelect: item.pay_way == isSelectPayWay,
                            noSelect: item.pay_way != isSelectPayWay,
                            'mt-2': isMobile
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
            </div>
            <div class="mt-[40px]">
                <el-button
                    type="primary"
                    class="!px-[42px] !py-[18px]"
                    @click="toPay"
                    >确认支付</el-button
                >
            </div>
        </el-card>
        <el-card v-else class="w-[1200px] py-[30px] flex flex-col items-center">
            充值功能暂未开启~~
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ElCard, ElImage, ElButton, ElInput } from 'element-plus'
import carousel from '../_components/carousel.vue'
import {
    getPayWay,
    rechargePrepay,
    prepay,
    getRechargeTemplateList
} from '~/api/pay'
import { getClient } from '~~/utils/client'
import { ClientEnum } from '@/enums/appEnums'
import wechatoa from '@/utils/wechat'
import { pay } from '@/utils/pay'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
const userStore = useUserStore()

const runtimeConfig = useRuntimeConfig()

//路由
const router = useRouter()

const isSelectTemplate = ref()

//选择套餐模板
const selectTemplate = (id: number) => {
    isSelectTemplate.value = id
}

const money = ref('')

//已选中的支付方式
const isSelectPayWay = ref<number>()

const { data: payWayList } = await useAsyncData(
    () => getPayWay({ from: ' recharge' }),
    {
        transform: (value) => {
            isSelectPayWay.value = value.lists[0].pay_way
            return value.lists
        }
    }
)

const { data: templateList } = await useAsyncData(
    () => getRechargeTemplateList(),
    {
        transform: (value) => {
            isSelectTemplate.value = value[0].id
            return value
        }
    }
)

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
            const { order_id, from } = await rechargePrepay({
                pay_way: isSelectPayWay.value,
                template_id:
                    isSelectTemplate.value == -1 ? '' : isSelectTemplate.value,
                money: isSelectTemplate.value == -1 ? money.value : '',
                terminal: getClient()
            })
            const payData = await prepay({
                from,
                pay_way: isSelectPayWay.value,
                order_id,
                terminal: getClient(),
                redirect: `${runtimeConfig.app.baseURL}generate/user/wallet`,
                code: wechatoa.getAuthData().code
            })
            await pay.run({
                payWay: isSelectPayWay.value as number,
                orderId: order_id,
                from: from,
                config: payData.config
            })
            userStore.getUser()
            router.push({
                path: '/generate/user/wallet'
            })
        } catch (error) {
            console.log(error)
            wechatoa.setAuthData()
        }
    }
}

onMounted(async () => {
    if (wechatoa.getAuthData().code) {
        // toPay()
        await wechatoa.getUrl()
    }
})
</script>

<style lang="scss" scoped>
.noSelect {
    border: 1px solid #e4e7ed;
}
.isSelect {
    border: 1px solid #ffb324;
    background: #fffaf0;
}
:deep(.el-input__wrapper) {
    background-color: transparent !important;
    box-shadow: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0px;
    padding: 0;

    font-weight: 5000;
}
:deep(.el-input__inner) {
    font-size: 24px;
    text-align: center;
}
</style>
