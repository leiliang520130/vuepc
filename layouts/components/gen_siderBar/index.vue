<template>
    <div class="bg-white h-full px-[12px] flex flex-col">
        <div class="logo pt-[20px]">
            <NuxtLink
                v-if="appStore.getWebsiteConfig.pc_logo"
                class="flex flex-col justify-center items-center"
                to="/"
            >
                <img
                    :src="appStore.getWebsiteConfig.pc_logo"
                    class="h-[34px]"
                />
                <div class="text-black font-bold mt-2">
                    {{ appStore.getWebsiteConfig.pc_title }}
                </div>
            </NuxtLink>
        </div>
        <div class="flex justify-center items-center mt-4">
            <el-button
                class="w-full !py-[16px]"
                type="primary"
                plain
                @click="toRecord"
                >购买记录</el-button
            >
        </div>
        <div class="flex-1 min-h-0">
            <slot />
        </div>
        <div class="user py-[14px] w-full flex flex-col justify-center">
            <User position="sider"></User>
            <div
                class="p-[10px] bg-primary-light-9 w-full rounded-md flex justify-between mt-2"
                v-if="userStore.isLogin"
            >
                <div class="font-bold">
                    账户：{{ userStore?.userInfo.user_money }}元
                </div>
                <NuxtLink to="/generate/recharge_center">
                    <el-button type="primary" link>充值</el-button>
                </NuxtLink>
            </div>
            <!-- <el-dropdown
                class="w-full"
                placement="right"
                @command="handleCommand"
                trigger="click"
            >
                <div class="flex items-center w-full">
                    <el-image
                        :src="userStore.userInfo.avatar"
                        class="w-[25px] h-[25px] rounded-full"
                    ></el-image>
                    <span class="ml-2">{{ userStore.userInfo.nickname }}</span>
                    <div class="ml-auto">
                        <Icon name="el-icon-ArrowRight"></Icon>
                    </div>
                </div>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem command="user">用户信息</ElDropdownItem>
                        <ElDropdownItem command="logout"
                            >退出登录</ElDropdownItem
                        >
                    </ElDropdownMenu>
                </template>
            </el-dropdown> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElButton, ElDropdown, ElImage, ElDropdownItem } from 'element-plus'
import { useUserStore } from '~~/stores/user'
import { useAppStore } from '~~/stores/app'
import { logout } from '~~/api/account'
import User from '../header/user.vue'

const appStore = useAppStore()
const userStore = useUserStore()

const router = useRouter()

//跳转至记录页面
const toRecord = () => {
    router.push({
        path: '/generate/record'
    })
}
const handleCommand = async (command: string) => {
    switch (command) {
        case 'logout':
            await feedback.confirm('确定退出登录吗？')
            await logout()
            userStore.logout()
            break
        case 'user':
            appStore.toShowUserPop()
            break
    }
}
</script>

<style scoped lang="scss"></style>
