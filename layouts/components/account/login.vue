<template>
    <div class="login">
        <!-- <div class="text-4xl">欢迎登录</div> -->
        <el-tabs v-model="formData.scene">
            <el-tab-pane
                v-if="includeLoginWay(LoginWayEnum.MOBILE)"
                label="手机号登录"
                :name="2"
            ></el-tab-pane>
            <el-tab-pane
                v-if="includeLoginWay(LoginWayEnum.EMAIL)"
                label="邮箱登录"
                :name="3"
            ></el-tab-pane>
        </el-tabs>
        <ElForm
            ref="formRef"
            class="mt-[15px]"
            size="large"
            :model="formData"
            :rules="formRules"
        >
            <template v-if="isMobileLogin && loginType == 'password'">
                <ElFormItem prop="account">
                    <ElInput
                        v-model="formData.account"
                        placeholder="请输入手机号"
                    />
                </ElFormItem>
                <ElFormItem prop="password">
                    <ElInput
                        v-model="formData.password"
                        type="password"
                        show-password
                        placeholder="请输入密码"
                    />
                </ElFormItem>
            </template>
            <template v-if="isEmailLogin && loginType == 'password'">
                <ElFormItem prop="account">
                    <ElInput
                        v-model="formData.account"
                        placeholder="请输入邮箱号"
                    />
                </ElFormItem>
                <ElFormItem prop="password">
                    <ElInput
                        v-model="formData.password"
                        type="password"
                        show-password
                        placeholder="请输入密码"
                    />
                </ElFormItem>
            </template>
            <template
                v-if="
                    isMobileLogin &&
                    includeLoginWay(LoginWayEnum.MOBILE) &&
                    loginType == 'code'
                "
            >
                <ElFormItem prop="account">
                    <ElInput
                        v-model="formData.account"
                        placeholder="请输入手机号"
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
            </template>
            <template
                v-if="
                    isEmailLogin &&
                    includeLoginWay(LoginWayEnum.EMAIL) &&
                    loginType == 'code'
                "
            >
                <ElFormItem prop="account">
                    <ElInput
                        v-model="formData.account"
                        placeholder="请输入邮箱号"
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
                                    @click-get="sendEmail"
                                />
                            </div>
                        </template>
                    </ElInput>
                </ElFormItem>
            </template>
            <div class="flex" v-if="isMobileLogin && openPswLogin">
                <div class="flex-1">
                    <ElButton
                        type="primary"
                        v-if="loginType == 'password'"
                        link
                        @click="changeLoginType"
                    >
                        手机验证码登录
                    </ElButton>
                    <ElButton
                        type="primary"
                        v-if="loginType == 'code'"
                        link
                        @click="changeLoginType"
                    >
                        手机密码登录
                    </ElButton>
                </div>

                <ElButton link @click="setPopupType(PopupTypeEnum.FORGOT_PWD)">
                    忘记密码？
                </ElButton>
            </div>
            <div class="flex" v-if="isEmailLogin && openPswLogin">
                <div class="flex-1">
                    <ElButton
                        type="primary"
                        v-if="loginType == 'password'"
                        link
                        @click="changeLoginType"
                    >
                        邮箱验证码登录
                    </ElButton>
                    <ElButton
                        type="primary"
                        v-if="loginType == 'code'"
                        link
                        @click="changeLoginType"
                    >
                        邮箱密码登录
                    </ElButton>
                </div>

                <ElButton
                    link
                    @click="setPopupType(PopupTypeEnum.EMAIL_FOEGOT_PWD)"
                >
                    忘记密码？
                </ElButton>
            </div>
            <ElFormItem class="mt-[30px]">
                <ElButton
                    class="w-full"
                    type="primary"
                    :loading="isLock"
                    @click="loginLock"
                >
                    登录
                </ElButton>
            </ElFormItem>
            <div class="text-info text-xs text-center mt-[20px]">
                未注册过的{{
                    formData.scene == LoginWayEnum.MOBILE ? '手机号' : '邮箱号'
                }}，登录即注册
            </div>
            <div
                class="mb-[-15px] mx-[-40px] mt-[30px] bg-primary-light-9 rounded-b-md px-[15px] flex leading-10"
            >
                <div class="flex-1">
                    <ElCheckbox v-if="isOpenAgreement" v-model="isAgreement">
                        <span class="text-tx-secondary text-sm">
                            已阅读并同意
                            <NuxtLink
                                :to="`/policy/${PolicyAgreementEnum.SERVICE}`"
                                custom
                                v-slot="{ href }"
                            >
                                <a
                                    class="text-tx-primary"
                                    :href="href"
                                    target="_blank"
                                >
                                    《服务协议》
                                </a>
                            </NuxtLink>
                            和
                            <NuxtLink
                                class="text-tx-primary"
                                :to="`/policy/${PolicyAgreementEnum.PRIVACY}`"
                                custom
                                v-slot="{ href }"
                            >
                                <a
                                    class="text-tx-primary"
                                    :href="href"
                                    target="_blank"
                                >
                                    《隐私政策》
                                </a>
                            </NuxtLink>
                        </span>
                    </ElCheckbox>
                </div>
                <div>
                    <!-- <ElButton
                        link
                        type="primary"
                        @click="setPopupType(PopupTypeEnum.REGISTER)"
                    >
                        <span class="text-sm">注册账号</span>
                    </ElButton> -->
                </div>
            </div>
        </ElForm>
    </div>
</template>
<script lang="ts" setup>
import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElTabs,
    ElTabPane,
    ElCheckbox,
    FormInstance,
    FormRules
} from 'element-plus'
import { useAccount, PopupTypeEnum } from './useAccount'
import { getWxCodeUrl, login, pwdLogin } from '@/api/account'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { smsSend, emailSend } from '~~/api/app'
import { PolicyAgreementEnum, SMSEnum } from '~~/enums/appEnums'
import feedback from '~~/utils/feedback'
import useStore from 'element-plus/es/components/table/src/store'
const appStore = useAppStore()
const userStore = useUserStore()
const { setPopupType, toggleShowPopup } = useAccount()
enum LoginWayEnum {
    ACCOUNT = 1,
    MOBILE = 2,
    EMAIL = 3
}
const isAgreement = ref(false)
const formRef = shallowRef<FormInstance>()
const formRules: FormRules = {
    account: [
        {
            required: true,
            validator(rule: any, value: any, callback: any) {
                if (value === '') {
                    callback(
                        new Error(
                            formData.scene == LoginWayEnum.MOBILE
                                ? '请输入手机号'
                                : '请输入邮箱号'
                        )
                    )
                    return
                }
                callback()
            },
            trigger: ['change', 'blur']
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
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
const formData = reactive({
    code: '',
    account: '',
    password: '',
    scene: 0
})
// const isAccountLogin = computed(() => formData.scene == LoginWayEnum.ACCOUNT)
const isEmailLogin = computed(() => formData.scene == LoginWayEnum.EMAIL)
const isMobileLogin = computed(() => formData.scene == LoginWayEnum.MOBILE)
const includeLoginWay = (way: LoginWayEnum) =>
    appStore.getLoginConfig.login_way?.includes(String(way))

const openPswLogin = computed(() => appStore.getLoginConfig.support_pwd == 1)

// const inWxAuth = computed(() => {
//     return appStore.getLoginConfig.wechat_auth
// })

const isOpenAgreement = computed(
    () => appStore.getLoginConfig.login_agreement == 1
)
// const isOpenOtherAuth = computed(() => appStore.getLoginConfig.third_auth == 1)
const isForceBindMobile = computed(
    () => appStore.getLoginConfig.coerce_mobile == 1
)
// const changeLoginWay = () => {
//     if (formData.scene == LoginWayEnum.ACCOUNT) {
//         formData.scene = LoginWayEnum.MOBILE
//     } else {
//         formData.scene = LoginWayEnum.ACCOUNT
//     }
// }

const loginType = ref('code')
const changeLoginType = () => {
    if (loginType.value == 'code') {
        loginType.value = 'password'
    } else {
        loginType.value = 'code'
    }
}

const verificationCodeRef = shallowRef()
//发送短信
const sendSms = async () => {
    await formRef.value?.validateField(['account'])
    await smsSend({
        scene: SMSEnum.LOGIN,
        mobile: formData.account
    })

    verificationCodeRef.value?.start()
}
//发送邮件
const sendEmail = async () => {
    await formRef.value?.validateField(['account'])
    await emailSend({
        scene: SMSEnum.LOGIN,
        email: formData.account
    })
    verificationCodeRef.value?.start()
}

const handleLogin = async () => {
    await formRef.value?.validate()
    let data
    if (loginType.value == 'code') {
        data = await login(formData)
    } else {
        data = await pwdLogin(formData)
    }

    if (isForceBindMobile.value && !data.mobile) {
        userStore.temToken = data.token
        setPopupType(PopupTypeEnum.BIND_MOBILE)
        return
    }
    userStore.login(data.token)
    await userStore.getUser()
    if (userStore.userInfo.is_new_user == 1 && openPswLogin.value) {
        setPopupType(PopupTypeEnum.SET_PSW)
    } else {
        toggleShowPopup(false)
    }
}
const { lockFn: handleLoginLock, isLock } = useLockFn(handleLogin)
const agreementConfirm = async () => {
    console.log(isOpenAgreement.value)

    if (isAgreement.value || !isOpenAgreement.value) {
        return
    }
    await feedback.confirm('确认已阅读并同意《服务协议》和《隐私政策》')
    isAgreement.value = true
}
const loginLock = async () => {
    await agreementConfirm()
    await handleLoginLock()
}

// const getWxCode = async () => {
//     await agreementConfirm()
//     const { url } = await getWxCodeUrl()
//     window.location.href = url
// }
// const { lockFn: getWxCodeLock } = useLockFn(getWxCode)
watch(
    () => appStore.getLoginConfig,
    (value) => {
        const { login_way, default_login_way } = value
        if (
            login_way &&
            login_way.length &&
            includeLoginWay(default_login_way)
        ) {
            formData.scene = default_login_way
        } else {
            formData.scene = login_way.at(0)
        }
    },
    {
        immediate: true
    }
)
</script>

<style lang="scss" scoped></style>
