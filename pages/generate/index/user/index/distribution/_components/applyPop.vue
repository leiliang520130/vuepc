<template>
    <popup
        ref="popRef"
        title="申请成为分销商"
        confirmButtonText="提交申请"
        async
        @confirm="handleSub"
        @close="$emit('close')"
    >
        <el-form
            label-width="80px"
            ref="ruleFormRef"
            :rules="rules"
            :model="params"
        >
            <el-form-item label="真实姓名" prop="name">
                <el-input
                    placeholder="请输入真实名称"
                    v-model="params.name"
                ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="mobile">
                <el-input
                    placeholder="请输入联系方式"
                    v-model="params.mobile"
                ></el-input>
            </el-form-item>

            <el-form-item label="">
                <el-checkbox :true-label="1" :false-label="0" v-model="isRead">
                    <div>
                        <span>阅读并同意</span>
                        <NuxtLink to="/policy/distribution">
                            <span class="text-primary cursor-pointer"
                                >《用户分销协议》</span
                            >
                        </NuxtLink>
                    </div>
                </el-checkbox>
            </el-form-item>
        </el-form>
    </popup>
</template>

<script lang="ts" setup>
import { apply } from '@/api/distribution'
import { ElForm, ElFormItem, ElInput, ElCheckbox } from 'element-plus'

const emits = defineEmits(['close', 'submit'])

//表单ref
const ruleFormRef = shallowRef<InstanceType<typeof ElForm>>()
const params = ref({
    name: '',
    mobile: ''
})

const isRead = ref(0)

const popRef = shallowRef()

//表单校验规则
const rules = reactive({
    name: [{ required: true, message: '请输入真实名称', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
})

//提交申请
const handleSub = async () => {
    if (!ruleFormRef) {
        console.log(ruleFormRef)
        return
    }
    await ruleFormRef.value?.validate()
    if (isRead.value == 1) {
        await apply(params.value)
        emits('submit')
    } else {
        feedback.msgError('请先阅读并同意《用户分销协议》！')
    }
}

const open = (applyData: any) => {
    popRef.value.open()
    Object.keys(params.value).map((item) => {
        //@ts-ignore
        params.value[item] = applyData[item]
    })
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>
