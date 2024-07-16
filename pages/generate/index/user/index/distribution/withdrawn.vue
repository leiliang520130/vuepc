<template>
    <div>
        <div class="secondBg rounded-lg p-[20px]">
            <div @click="$router.back()">
                <ElButton type="primary" link>
                    <Icon name="el-icon-Back"></Icon>
                    返回
                </ElButton>
            </div>
            <el-form
                ref="ruleFormRef"
                :rules="rules"
                :model="formData"
                class="mt-[23px]"
                label-width="120px"
            >
                <el-form-item label="提现金额" prop="money">
                    <div class="w-[240px]">
                        <el-input
                            placeholder="输入提现金额"
                            v-model="formData.money"
                        >
                            <template #append> 元 </template>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="提现方式">
                    <div class="flex">
                        <div
                            class="py-[9px] px-[18px] flex items-center unSelect rounded-lg mr-[10px] cursor-pointer"
                            :class="{
                                isSelect: formData.type == item.id
                            }"
                            v-for="(item, index) in typeList"
                            :key="index"
                            @click="selectType(item.id)"
                        >
                            <img
                                class="w-[24px] h-[24px]"
                                :src="item.image"
                                alt=""
                            />
                            <div class="ml-2">{{ item.title }}</div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item
                    :label="`${formData.type == 3 ? '微信' : '支付宝'}账号`"
                    prop="account"
                    v-if="formData.type !== 2"
                >
                    <div class="w-[240px]">
                        <el-input
                            :placeholder="`请输入${
                                formData.type == 3 ? '微信' : '支付宝'
                            }账号`"
                            v-model="formData.account"
                        >
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item
                    label="真实姓名"
                    prop="real_name"
                    v-if="formData.type !== 2"
                >
                    <div class="w-[240px]">
                        <el-input
                            placeholder="请输入真实姓名"
                            v-model="formData.real_name"
                        >
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item
                    label="收款二维码"
                    class="is-required"
                    v-if="formData.type == 3 || formData.type == 4"
                >
                    <CropperUpload @change="getCodeImage">
                        <div
                            class="w-[100px] h-[100px]"
                            style="border: 1px dashed #e2e2e2"
                            v-if="!formData.money_qr_code"
                        >
                            <div
                                class="text-[#888888] flex flex-col items-center justify-center mt-[20px]"
                            >
                                <Icon
                                    size="30px"
                                    name="el-icon-Plus"
                                    color="#888888"
                                ></Icon>
                                <div>上传二维码</div>
                            </div>
                        </div>
                        <el-image
                            class="w-[100px] h-[100px]"
                            :src="formData.money_qr_code"
                            v-if="formData.money_qr_code"
                        ></el-image>
                    </CropperUpload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="apply(ruleFormRef)"
                        >确认提现</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="secondBg rounded-lg p-[20px] mt-4">
            <div class="secondTitle relative">
                <span class="ml-[10px] font-bold">提现记录</span>
            </div>
            <div class="w-full mt-[23px] overflow-auto">
                <el-table size="large" :data="pager.lists">
                    <el-table-column
                        label="提现单号"
                        prop="sn"
                    ></el-table-column>
                    <el-table-column
                        label="提现金额"
                        prop="money"
                    ></el-table-column>
                    <el-table-column label="手续费">
                        <template #default="{ row }">
                            <div>
                                {{ row.handling_fee }}({{
                                    row.handling_fee_ratio
                                }})
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="到账金额"
                        prop="left_money"
                    ></el-table-column>
                    <el-table-column
                        label="提现方式"
                        prop="type_desc"
                    ></el-table-column>
                    <el-table-column
                        label="提现状态"
                        prop="status_desc"
                    ></el-table-column>
                    <el-table-column
                        label="申请时间"
                        prop="create_time"
                    ></el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <div>
                                <el-button
                                    type="primary"
                                    link
                                    @click="toDetail(row.id)"
                                    >详情</el-button
                                >
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="flex justify-end mt-4">
                    <pagination v-model="pager" @change="getLists" />
                </div>
            </div>
        </div>
        <withdrawal-detail ref="popRef"></withdrawal-detail>
    </div>
</template>
<script lang="ts" setup>
import {
    ElButton,
    ElTable,
    ElTableColumn,
    ElForm,
    ElFormItem,
    ElInput,
    ElImage
} from 'element-plus'
import { withdrawWay, withdrawList, applyWithdraw } from '@/api/distribution'
import withdrawalDetail from './_components/withdrawalDetail.vue'

//弹框ref
const popRef = shallowRef()
//表单ref
const ruleFormRef = ref()
//表单校验规则
const rules = reactive({
    money: [{ required: true, message: '请输入提现金额', trigger: 'blur' }],
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    real_name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
})

//提现数据
const formData = ref({
    money_qr_code: '',
    money: '',
    account: '',
    real_name: '',
    type: 3 //提现方式：1-支付宝；2-微信零钱；3-微信收款码；4-支付宝收款码；
})

//提现方式
const typeList: any = ref([])

//获取提现方式
const getWithdrawWayList = async () => {
    typeList.value = await withdrawWay()
    // formData.value.type = typeList.value[0].id
    selectType(typeList.value[0].id)
}

//缓存的支付信息
const cacheAli = ref({
    account: '',
    real_name: ''
})
const cacheWx = ref({
    account: '',
    real_name: ''
})

//选择提现方式
const selectType = async (value: any) => {
    formData.value.type = value
    await nextTick()
    //设置缓存数据
    if (value == 1 || value == 4) {
        Object.keys(cacheAli.value).map((item) => {
            //@ts-ignore
            formData.value[item] = cacheAli.value[item]
        })
    }
    if (value == 3) {
        Object.keys(cacheWx.value).map((item) => {
            //@ts-ignore
            formData.value[item] = cacheWx.value[item]
        })
    }
}

//打开弹框
const toDetail = (id: any) => {
    popRef.value.open({ id })
}

//获取提现二维码图片
const getCodeImage = (value: any) => {
    formData.value.money_qr_code = value
}

//分页组件
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: withdrawList
})

const apply = async (formEl) => {
    if (!formEl) {
        console.log(formEl)
        return
    }
    await formEl.validate()
    await feedback.confirm('请确认是否提现！')
    await applyWithdraw(formData.value)
    await feedback.msgSuccess('申请成功！')
    formEl.resetFields()
    getLists()
}

onMounted(async () => {
    // await getCenterData()
    await getLists()
    await getWithdrawWayList()
})
</script>

<style lang="scss" scoped>
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
.unSelect {
    border: 1px solid #e5e5e5;
}
.isSelect {
    border: 1px solid var(--el-color-primary);
    background: var(--el-color-primary-light-9);
}
::v-deep .el-table {
    width: 100%;
    .el-table__header-wrapper table,
    .el-table__body-wrapper table {
        width: 100% !important;
    }
    .el-table__body,
    .el-table__footer,
    .el-table__header {
        table-layout: auto;
    }
}
</style>
