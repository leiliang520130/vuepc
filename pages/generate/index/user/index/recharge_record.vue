<template>
    <div>
        <div class="shadow rounded-lg overflow-hidden w-full">
            <el-table :data="data.lists">
                <el-table-column
                    label="订单编号"
                    prop="order_sn"
                    min-width="90"
                ></el-table-column>
                <el-table-column
                    label="支付方式"
                    prop="pay_way_text"
                    min-width="90"
                ></el-table-column>
                <el-table-column
                    label="实付金额"
                    prop="order_amount"
                    min-width="90"
                ></el-table-column>
                <el-table-column
                    label="状态"
                    prop="status_text"
                    min-width="90"
                ></el-table-column>
                <el-table-column
                    label="支付时间"
                    prop="pay_time"
                    min-width="90"
                ></el-table-column>
            </el-table>
        </div>
        <div class="py-4 flex justify-end">
            <el-pagination
                v-model:current-page="params.page_no"
                :total="data.count"
                :page-size="params.page_size"
                layout="total, prev, pager, next, jumper"
                @current-change="refresh()"
                hide-on-single-page
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { getRechargeRecordList } from '~/api/record'

const params = reactive({
    page_no: 1,
    page_size: 15
})

const { data, refresh } = await useAsyncData(
    () => getRechargeRecordList(params),
    {
        transform: (value) => {
            return value
        }
    }
)
</script>

<style lang="scss" scoped></style>
