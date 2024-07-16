<template>
    <div class="login">
        <div class="flex justify-between">
            <span class="text-4xl">设置密码</span>
        </div>
        <ElForm
            ref="formRef"
            class="mt-[35px]"
            size="large"
            :model="formData"
            :rules="formRules"
        >
            <ElFormItem prop="account">
                <ElInput v-model="formData.password" placeholder="请输入密码" />
            </ElFormItem>
            <ElFormItem prop="account">
                <ElInput
                    v-model="formData.password_confirm"
                    placeholder="再次确认密码"
                />
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
            <ElFormItem class="mt-[-20px]">
                <ElButton class="w-full mt-2" @click="toggleShowPopup(false)">
                    暂不设置
                </ElButton>
            </ElFormItem>
        </ElForm>
    </div>
</template>

<script setup lang="ts">
import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    FormInstance,
    FormRules
} from 'element-plus'
import { useAccount, PopupTypeEnum } from './useAccount'
import { userSetPwd } from '~~/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { setPopupType, toggleShowPopup } = useAccount()
const formRef = shallowRef<FormInstance>()

const formData = reactive({
    password: '',
    password_confirm: ''
})

const formRules: FormRules = {
    password: [
        {
            required: true,
            message: '请输入6-20位数字+字母或符号组合',
            trigger: ['change', 'blur']
        },
        {
            min: 6,
            max: 20,
            message: '密码长度应为6-20',
            trigger: ['change', 'blur']
        }
    ],
    password_confirm: [
        {
            validator(rule: any, value: any, callback: any) {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== formData.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: ['change', 'blur']
        }
    ]
}

const handleConfirm = async () => {
    await formRef.value?.validate()
    await userSetPwd(formData)
    toggleShowPopup(false)
}

const { lockFn: handleConfirmLock, isLock } = useLockFn(handleConfirm)
</script>
