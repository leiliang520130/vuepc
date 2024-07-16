<template>
    <div>
        <div
            class="py-[32px] px-[60px] bg-gradient-to-br from-primary-light-8 from-10% via-primary-light-9 via-50% to-primary-light-8 to-90% w-full"
        >
            <div class="text-[20px]">我的余额</div>
            <div class="mt-2">
                <span class="text-[20px]">￥</span>
                <span class="text-[28px] font-bold">{{
                    userStore.userInfo.user_money
                }}</span>
                <span
                    class="ml-4 text-primary text-[20px] cursor-pointer"
                    @click="toRecharge"
                    v-if="appStore.rechargeConfig.status == 1"
                    >充值</span
                >
            </div>
        </div>
        <div class="p-[20px] rounded-lg bg-[#F4F6FE] mt-4">
            <div class="secondTitle relative">
                <span class="ml-[10px] font-bold">余额明细</span>
            </div>
            <div class="mt-2">
                <el-table :data="data.lists">
                    <el-table-column
                        label="订单编号"
                        prop="source_sn"
                    ></el-table-column>
                    <el-table-column
                        label="变动类型"
                        prop="change_type_desc"
                    ></el-table-column>
                    <el-table-column
                        label="记录时间"
                        prop="create_time"
                    ></el-table-column>
                    <el-table-column
                        label="余额变动"
                        prop="change_amount_desc"
                    ></el-table-column>
                </el-table>
                <div class="py-4 flex justify-end">
                    <el-pagination
                        v-model:current-page="params.page_no"
                        :total="data?.count"
                        :page-size="params.page_size"
                        layout="total, prev, pager, next, jumper"
                        @current-change="refresh()"
                        hide-on-single-page
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getRechargeRecordList } from '~/api/record'
import { MoneyList } from '~/api/distribution'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const params = reactive({
    page_no: 1,
    page_size: 15,
    type: 'um'
})

const { data, refresh } = await useAsyncData(() => MoneyList(params), {
    transform: (value) => {
        return value
    }
})
const toRecharge = () => {
    router.push('/generate/recharge_center')
}
</script>

<style lang="scss" scoped>
.secondTitle {
    &::before {
        content: '';
        position: absolute;
        width: 5px;
        height: 100%;
        background: var(--el-color-primary);
    }
}
</style>
