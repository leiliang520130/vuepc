<template>
    <div class="main">
        <div class="text-[18px] font-bold">
            {{ hasMobile ? '修改' : '设置' }}密码
        </div>
        <div class="flex flex-col mt-4">
            <el-form :model="formData" :rules="formRules" ref="formRef">
                <el-form-item>
                    <el-input
                        :value="
                            userStore.userInfo?.mobile ||
                            userStore.userInfo?.email
                        "
                        class="!w-[340px]"
                        disabled
                    ></el-input>
                </el-form-item>

                <el-form-item
                    prop="code"
                    v-if="userStore.userInfo.loginWay == 'mobile'"
                >
                    <el-input
                        class="!w-[340px]"
                        v-model="formData.code"
                        placeholder="请输入验证码"
                    >
                        <template #suffix>
                            <div
                                class="flex justify-center leading-5 w-[90px] pl-2.5 border-l border-br"
                            >
                                <VerificationCode
                                    ref="verificationCodeRef"
                                    @click-get="sendSms"
                                />
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code" v-else>
                    <el-input
                        class="!w-[340px]"
                        v-model="formData.code"
                        placeholder="请输入验证码"
                    >
                        <template #suffix>
                            <div
                                class="flex justify-center leading-5 w-[90px] pl-2.5 border-l border-br"
                            >
                                <VerificationCode
                                    ref="verificationCodeRef"
                                    @click-get="sendEmail"
                                />
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="formData.password"
                        placeholder="请输入6-30位新密码"
                        class="!w-[340px]"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="formData.password_confirm"
                        placeholder="再次输入新密码"
                        class="!w-[340px]"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="mt-4">
            <el-button @click="submit" type="primary" class="w-[340px]"
                >确认</el-button
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ElInput,
    ElButton,
    ElForm,
    ElFormItem,
    FormInstance,
    FormRules
} from 'element-plus'
import { SMSEnum } from '~~/enums/appEnums'
import { smsSend, emailSend } from '~~/api/app'
import { useUserStore } from '@/stores/user'
import { userChangePwd } from '~~/api/user'

const userStore = useUserStore()

const verificationCodeRef = shallowRef()
const formRef = shallowRef<FormInstance>()
const hasMobile = computed(() => !!userStore.userInfo.mobile)
const formData = reactive({
    type: hasMobile.value ? 'change' : 'bind',
    // account: userStore.userInfo.mobile || userStore.userInfo.email,
    account:
        userStore.userInfo.loginWay == 'email'
            ? userStore.userInfo.email
            : userStore.userInfo.mobile,
    code: '',
    password: '',
    password_confirm: ''
})

const formRules: FormRules = {
    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: ['change', 'blur']
        }
    ],
    password: [
        {
            required: true,
            validator: (rule, value: string, callback) => {
                if (value.length >= 6 && value.length <= 30) {
                    callback()
                } else {
                    callback('密码长度不符合！')
                }
            }
        }
    ]
}

const sendSms = async () => {
    await formRef.value?.validateField(['mobile'])
    await smsSend({
        scene: SMSEnum.SZMMYZM,
        mobile: formData.account
    })
    verificationCodeRef.value?.start()
}

//发送邮件
const sendEmail = async () => {
    await formRef.value?.validateField(['account'])
    await emailSend({
        scene: SMSEnum.SZMMYZM,
        email: formData.account
    })
    verificationCodeRef.value?.start()
}

//提交
const submit = async () => {
    await formRef.value?.validate()
    await userChangePwd({
        ...formData,
        type: userStore.userInfo.loginWay == 'email' ? 'email' : 'mobile',
        scene: SMSEnum.SZMMYZM
    })
    userStore.logout()
}
</script>

<style lang="scss" scoped>
.main {
    background: linear-gradient(91.05deg, #f4f6fe 0%, #fff 100%);
    padding: 20px;
    border-radius: 14px;
}
</style>
