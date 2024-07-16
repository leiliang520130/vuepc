<template>
    <div>
        <ElDropdown
            class="w-full"
            v-if="userStore.isLogin"
            @command="handleCommand"
        >
            <div class="flex items-center w-full">
                <ElAvatar :size="25" :src="userStore.userInfo.avatar" />
                <div
                    class="ml-1 text-white text-lg flex-1 flex justify-between"
                >
                    <span class="mr-2 text-black">{{
                        userStore.userInfo.nickname
                    }}</span>
                    <Icon
                        name="el-icon-ArrowRight"
                        color="#000"
                        v-if="position == 'sider'"
                    ></Icon>
                    <ElIcon color="#000" v-else><ArrowDown /></ElIcon>
                </div>
            </div>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem command="wallet">个人中心</ElDropdownItem>
                    <ElDropdownItem command="wallet">我的钱包</ElDropdownItem>
                    <ElDropdownItem command="distribution"
                        >分销推广</ElDropdownItem
                    >
                    <ElDropdownItem command="toRecharge"
                        >充值中心</ElDropdownItem
                    >
                    <!-- <ElDropdownItem command="buy">购买记录</ElDropdownItem>
                    <ElDropdownItem command="recharge">充值记录</ElDropdownItem> -->
                    <ElDropdownItem command="password">密码设置</ElDropdownItem>

                    <ElDropdownItem command="logout">退出登录</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
        <el-button v-else type="primary" @click="handleToLogin"
            >登录/注册</el-button
        >
    </div>
</template>
<script lang="ts" setup>
import {
    ElAvatar,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElIcon,
    ElButton
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { PopupTypeEnum, useAccount } from '../account/useAccount'
import feedback from '~~/utils/feedback'
import { logout } from '~~/api/account'
import { useAppStore } from '~~/stores/app'
const { setPopupType, toggleShowPopup } = useAccount()
const appStore = useAppStore()
const userStore = useUserStore()

const router = useRouter()

const props = defineProps({
    position: {
        type: String,
        defautl: 'header'
    }
})

const handleToLogin = () => {
    setPopupType(PopupTypeEnum.LOGIN)
    toggleShowPopup(true)
}

const handleCommand = async (command: string) => {
    switch (command) {
        case 'logout':
            await feedback.confirm('确定退出登录吗？')
            await logout()
            userStore.logout()
            break
        case 'buy':
            router.push('/generate/user/buy_record')
            break
        case 'wallet':
            router.push('/generate/user/wallet')
            break
        case 'distribution':
            router.push('/generate/user/distribution')
            break
        case 'recharge':
            router.push('/generate/user/recharge_record')
            break
        case 'password':
            router.push('/generate/user/password')
            break
        case 'toRecharge':
            router.push('/generate/recharge_center')
            break
    }
}
</script>

<style lang="scss" scoped></style>
