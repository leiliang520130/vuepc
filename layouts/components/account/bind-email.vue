<template>
    <div class="login">
        <div class="flex justify-between">
            <span class="text-4xl">
                {{ hasEmail ? '更换邮箱账号' : '绑定邮箱账号' }}
            </span>
        </div>
        <ElForm
            ref="formRef"
            class="mt-[35px]"
            size="large"
            :model="formData"
            :rules="formRules"
        >
            <ElFormItem prop="email">
                <ElInput
                    v-model="formData.email"
                    placeholder="请输入邮箱账号"
                />
            </ElFormItem>
            <ElFormItem prop="code">
                <ElInput v-model="formData.code" placeholder="请输入验证码">
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
                </ElInput>
            </ElFormItem>
            <ElFormItem class="mt-[60px]">
                <ElButton
                    class="w-full"
                    type="primary"
                    @click="handleConfirmLock"
                    :loading="isLock"
                >
                    确认
                </ElButton>
            </ElFormItem>
        </ElForm>
    </div>
</template>
<script lang="ts" setup>
import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    FormInstance,
    FormRules
} from 'element-plus'
import { emailSend } from '~~/api/app'
import { userBindEmail } from '~~/api/user'
import { SMSEnum } from '~~/enums/appEnums'
import { useAccount } from './useAccount'
import { useUserStore } from '@/stores/user'
const { toggleShowPopup } = useAccount()
const userStore = useUserStore()
const formRef = shallowRef<FormInstance>()
const verificationCodeRef = shallowRef()
const formRules: FormRules = {
    email: [
        {
            required: true,
            message: '请输入手机号码',
            trigger: ['change', 'blur']
        }
    ],
    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: ['change', 'blur']
        }
    ]
}
const hasEmail = computed(() => !!userStore.userInfo.email)
const formData = reactive({
    type: hasEmail.value ? 'change' : 'bind',
    email: '',
    code: ''
})

const sendSms = async () => {
    await formRef.value?.validateField(['mobile'])
    await emailSend({
        scene: hasEmail.value ? SMSEnum.CHANGR_EMAIL : SMSEnum.BIND_EMAIL,
        email: formData.email
    })
    verificationCodeRef.value?.start()
}

const handleConfirm = async () => {
    await formRef.value?.validate()
    if (userStore.isLogin) {
        await userBindEmail(formData)
    } else {
        await userBindEmail(formData, { token: userStore.temToken })
        userStore.login(userStore.temToken)
        await userStore.getUser()
    }
    toggleShowPopup(false)
}
const { lockFn: handleConfirmLock, isLock } = useLockFn(handleConfirm)
</script>

<style lang="scss" scoped></style>
