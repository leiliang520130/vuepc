<template>
    <div class="main">
        <template v-if="appStore.config.distribution.status == 1">
            <div class="secondBg rounded-lg p-[20px]">
                <div class="secondTitle relative">
                    <span class="ml-[10px] font-bold">分销规则</span>
                </div>
                <div class="mt-4 flex" :class="{ ' flex-col': isMobile }">
                    <div
                        class="w-[300px] rounded px-[15px] py-[20px] shadow relative"
                        :class="{ '!w-full': isMobile }"
                        style="
                            background: linear-gradient(
                                228deg,
                                #ffefe6 0%,
                                #ffe8cf 12.32%,
                                #e1ab7a 82.76%,
                                #e1ab7a 100%
                            );
                        "
                        v-if="centerData?.config.level >= 1"
                    >
                        <div class="text-[#6A3D15] font-bold">一级分销</div>
                        <div class="text-[#6A3D15] mt-4">
                            成为分销商，下级消费您获得{{
                                centerData?.config?.first_ratio
                            }}%奖励
                        </div>
                        <div
                            class="text-[#6A3D15] px-[16px] py-[6px] bg-[#dba682] rounded-tr rounded-bl absolute top-0 right-0"
                        >
                            分佣{{ centerData?.config?.first_ratio }}%
                        </div>
                    </div>
                    <div
                        class="w-[300px] rounded px-[15px] py-[20px] shadow relative"
                        :class="{
                            'ml-4': !isMobile,
                            'mt-2': isMobile,
                            '!w-full': isMobile
                        }"
                        style="
                            background: linear-gradient(
                                270deg,
                                #e3d0ff 0%,
                                #b36ffc 100%
                            );
                        "
                        v-if="centerData?.config.level == 2"
                    >
                        <div class="text-[#6A3D15] font-bold">二级分销</div>
                        <div class="text-[#6A3D15] mt-4">
                            成为分销商，下2级消费您获得{{
                                centerData?.config?.second_ratio
                            }}%奖励
                        </div>
                        <div
                            class="text-[#3E2077] px-[16px] py-[6px] bg-[#8867c5] rounded-tr rounded-bl absolute top-0 right-0"
                        >
                            分佣{{ centerData?.config?.second_ratio }}%
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-[40px] secondBg rounded-lg p-[20px]">
                <div class="secondTitle relative flex justify-between">
                    <span class="ml-[10px] font-bold">我的收益</span>
                    <div
                        v-if="centerData?.user?.is_distribution"
                        class="text-primary flex items-center cursor-pointer"
                    >
                        <Icon name="el-icon-Memo"></Icon>
                        <span class="ml-2" @click="openIncomeDetailPop"
                            >收益明细</span
                        >
                    </div>
                </div>
                <template
                    v-if="
                        !centerData?.user?.is_distribution &&
                        centerData?.config?.condition == 2
                    "
                >
                    <div class="mt-2 text-info">
                        抱歉，您当前还不是分销商，请先申请成为分销商
                    </div>
                    <el-button
                        class="mt-2"
                        v-if="centerData?.apply_detail?.status == 1"
                        type="primary"
                        >等待申请通过</el-button
                    >
                    <el-button
                        class="mt-2"
                        v-else
                        type="primary"
                        @click="openApplyPop"
                        >申请成为分销商</el-button
                    >
                    <div
                        v-if="centerData?.apply_detail?.status == 3"
                        class="text-error mt-2"
                    >
                        拒绝原因：{{ centerData?.apply_detail.audit_remark }}
                    </div>
                </template>
                <template
                    v-if="
                        centerData?.user?.is_distribution ||
                        centerData?.config?.condition == 1
                    "
                >
                    <div class="mt-2 flex justify-between items-center">
                        <div
                            class="mt-[20px] w-3/4"
                            :class="{ ' flex': !isMobile }"
                        >
                            <div class="w-[320px]">
                                <div class="text-[13px]">提现余额（元）</div>
                                <div class="text-primary text-[30px] font-bold">
                                    {{ centerData?.user?.user_earnings }}
                                </div>
                            </div>
                            <div class="w-[320px]">
                                <div class="text-[13px]">今日收益（元）</div>
                                <div class="text-[30px] font-bold">
                                    +{{ centerData?.user?.today_earnings }}
                                </div>
                            </div>
                            <div class="w-[320px]">
                                <div class="text-[13px]">已提现（元）</div>
                                <div class="text-[30px] font-bold">
                                    {{ centerData?.user?.withdrawn_money }}
                                </div>
                            </div>
                            <div class="w-[320px]">
                                <div class="text-[13px]">累计收益（元）</div>
                                <div class="text-[30px] font-bold">
                                    {{ centerData?.user?.total_earnings }}
                                </div>
                            </div>
                        </div>
                        <el-button type="primary" @click="toWithDrawn"
                            >去提现</el-button
                        >
                    </div>
                </template>
            </div>
            <div
                v-if="
                    centerData?.user?.is_distribution ||
                    centerData?.config?.condition == 1
                "
                class="secondBg rounded-lg p-[20px] mt-[20px]"
            >
                <div class="secondTitle relative">
                    <span class="ml-[10px] font-bold">推广链接</span>
                </div>
                <div class="flex mt-[20px]">
                    <el-input
                        :value="centerData?.config?.pc_promotion_url"
                        disabled
                        class="!w-[300px]"
                    ></el-input>
                    <el-button
                        class="ml-2"
                        @click="copy(centerData?.config?.pc_promotion_url)"
                        >复制链接</el-button
                    >
                </div>
            </div>
            <div
                class="secondBg rounded-lg p-[20px] mt-[20px]"
                v-if="
                    centerData?.user?.is_distribution ||
                    centerData?.config?.condition == 1
                "
            >
                <div class="secondTitle relative">
                    <span class="ml-[10px] font-bold">邀请列表</span>
                </div>
                <div>
                    <el-tabs
                        v-model="params.level"
                        @tab-change="tabChange"
                        class="demo-tabs"
                    >
                        <el-tab-pane
                            :label="`全部(${pager.extend.all})`"
                            name=""
                        ></el-tab-pane>
                        <el-tab-pane
                            :label="`直接用户(${pager.extend.first})`"
                            :name="1"
                        ></el-tab-pane>
                        <el-tab-pane
                            :label="`间接用户(${pager.extend.second})`"
                            :name="2"
                        ></el-tab-pane>
                    </el-tabs>

                    <el-table :data="pager.lists" class="mt-2">
                        <el-table-column
                            label="用户昵称"
                            prop="order_sn"
                            min-width="220"
                        >
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image
                                        class="w-[50px] h-[50px]"
                                        :src="row.avatar"
                                    ></el-image>
                                    <div class="ml-2">{{ row.nickname }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="订单量"
                            prop="order_num"
                        ></el-table-column>
                        <el-table-column
                            label="累计消费"
                            prop="total_amount"
                        ></el-table-column>
                        <el-table-column label="邀请人数" prop="invite_num">
                            <template #default="{ row }">
                                <div class="text-primary">
                                    {{ row.invite_num }}人
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="分销资格"
                            prop="pay_status_desc"
                        >
                            <template #default="{ row }">
                                <div>{{ row.is_distribution_desc }}</div>
                                <div class="text-info">
                                    {{ row.distribution_time }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="注册时间"
                            prop="create_time"
                        ></el-table-column>
                    </el-table>

                    <div class="flex justify-end mt-4">
                        <pagination v-model="pager" @change="getLists" />
                    </div>
                </div>
            </div>
            <applyPopVue
                v-if="applyPopShow"
                ref="applyPopRef"
                @close="applyPopShow = false"
                @submit="
                    () => {
                        applyPopShow = false
                        getCenterData()
                    }
                "
            ></applyPopVue>
            <incomeDetailPopVue ref="incomeDetailPopRef"></incomeDetailPopVue>
        </template>
        <template v-else>
            <div class="text-info text-lg text-center py-[30rpx]">
                分销功能暂未开启~
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import {
    ElButton,
    ElInput,
    ElTabs,
    ElTabPane,
    ElTable,
    ElTableColumn,
    ElImage
} from 'element-plus'
import applyPopVue from './_components/applyPop.vue'
import incomeDetailPopVue from './_components/incomeDetailPop.vue'
import { nextTick } from 'vue'
import { usePaging } from '@/utils/usePaging'
import { fansList, distributionCenter } from '@/api/distribution'
import { copy } from '@/utils/util'
import { useAppStore } from '@/stores/app'

const router = useRouter()

const appStore = useAppStore()

//申请成为分销商弹框
const applyPopRef = shallowRef()

const applyPopShow = ref(false)

//打开申请成为分销商弹框
const openApplyPop = async () => {
    applyPopShow.value = true
    await nextTick()
    applyPopRef.value.open(centerData.value.apply_detail)
}

//收益弹框
const incomeDetailPopRef = shallowRef()

const openIncomeDetailPop = () => {
    incomeDetailPopRef.value.open()
}

//请求参数
const params = reactive({
    level: '' //1-直接用户 2-间接用户
})

//分页组件
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: fansList,
    params: params
})

const tabChange = async () => {
    await nextTick()
    getLists()
}

//分销数据
const centerData: any = ref()
// const { apply_detail, config, user, withdraw_config } = centerData.value
const getCenterData = async () => {
    centerData.value = await distributionCenter()
}

const toWithDrawn = () => {
    router.push('/generate/user/distribution/withdrawn')
}

onMounted(() => {
    getCenterData()
    getLists()
})
</script>

<style lang="scss" scoped>
.main {
    .secondBg {
        background: linear-gradient(89.67deg, #f4f6fe 0%, #fff 100%);
    }

    .secondTitle {
        &::before {
            content: '';
            position: absolute;
            width: 5px;
            height: 100%;
            background: var(--el-color-primary);
        }
    }
}
</style>
