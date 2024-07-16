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
                    label="题目"
                    prop="subject"
                    min-width="150"
                ></el-table-column>
                <el-table-column label="类型" prop="category"></el-table-column>
                <el-table-column
                    label="支付状态"
                    prop="pay_status_desc"
                ></el-table-column>
                <el-table-column
                    label="实付金额"
                    prop="order_amount"
                ></el-table-column>
                <el-table-column
                    label="生成状态"
                    prop="gen_status_desc"
                    min-width="150"
                >
                    <template #default="{ row }">
                        <div :class="{ 'text-danger': row.gen_status == 3 }">
                            <span>{{ row.gen_status_desc }}</span>
                            <span class="ml-2 text-danger">{{
                                row.progress_bar
                            }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="120">
                    <template #default="{ row }">
                        <div>
                            <el-button
                                :loading="row.id == loadingId"
                                class="PrimaryBtnColor"
                                @click="dowmload(row.id)"
                                type="primary"
                                v-if="row.gen_status == 2"
                                >下载</el-button
                            >
                            <el-button
                                class="PrimaryBtnColor"
                                @click="retry(row.id)"
                                type="danger"
                                v-if="row.gen_status == 3"
                                >重新生成</el-button
                            >
                        </div>
                    </template>
                </el-table-column>
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

        <div
            class="text-[#666666] mt-4 w-full bg-[#f6f6f6] p-[15px] rounded-lg"
        >
            <div>温馨提示:</div>
            <div class="mt-[15px]">
                <pre>{{ tipsData?.content }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElPagination, ElButton } from 'element-plus'
import { getTipsContent } from '~/api/generate'
import { getOrderList, downloadDom, toRetry } from '~/api/record'
import usePolling from '@/composables/usePolling'

import { isWeixinClient, isAndroid } from '@/utils/client'

const router = useRouter()

const loadingId = ref(-1)

const params = reactive({
    page_no: 1,
    page_size: 15,
    keyword: '',
    cid: '',
    sort: ''
})

const { data, refresh } = await useAsyncData(() => getOrderList(params), {
    transform: (value) => {
        return value
    }
})

const { start, end } = usePolling(refresh, { time: 5000 })

const pollingStatus = ref(false)

watch(
    () => data,
    (value) => {
        const index = value.value.lists.findIndex((item) => item.gen_status < 2)

        if (index != -1 && pollingStatus.value == false) {
            pollingStatus.value = true
            start()
        }
        if (index == -1) {
            end()
            pollingStatus.value = false
        }
    },
    {
        immediate: true,
        deep: true
    }
)

//下载
const dowmload = async (id: number) => {
    loadingId.value = id
    const { url } = await downloadDom({ id })
    if (isAndroid() && isWeixinClient()) {
        router.push(`/download?path=${encodeURIComponent(url)}`)
        return
    }

    window.location.href = `${url}&wx=${isWeixinClient() ? 1 : 0}`
    loadingId.value = -1
}

const retry = async (id: number) => {
    await toRetry({ id })
    refresh()
}

//获取提示数据
const { data: tipsData } = useAsyncData(() => getTipsContent({ type: 'tips' }))

definePageMeta({
    auth: true
})
</script>

<style lang="scss" scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
