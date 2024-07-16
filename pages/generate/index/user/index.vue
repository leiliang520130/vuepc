<template>
    <div>
        <div class="text-center relative w-full">
            <!-- <div
                class="flex items-center absolute font-medium cursor-pointer"
                @click="toBack"
            >
                <Icon name="el-icon-ArrowLeft" size="16"></Icon>
                <span class="ml-2">返回上一页</span>
            </div> -->
            <span class="font-medium text-[24px]">个人中心</span>
        </div>
        <el-card class="mt-4">
            <div class="userTitle relative flex justify-between">
                <span class="ml-[10px] font-bold">个人信息</span>
                <!-- <span class="text-error">退出登录</span> -->
                <div class="flex items-center" @click="loginOut">
                    <el-image
                        class="w-[10px] h-[10px]"
                        :src="loginOutIcon"
                    ></el-image>
                    <el-button class="ml-1" type="danger" link
                        >退出登录</el-button
                    >
                </div>
            </div>
            <div class="mt-[24px]" :class="{ flex: !isMobile }">
                <div class="avatar">
                    <ElAvatar
                        class="flex-none"
                        :size="80"
                        :src="userInfo?.avatar"
                    ></ElAvatar>
                    <div class="change-btn">
                        <CropperUpload
                            @change="setUserInfo($event, UserFieldEnum.AVATAR)"
                        >
                            <span class="text-xs text-white">修改</span>
                        </CropperUpload>
                    </div>
                </div>
                <div class="flex-1 ml-4" :class="{ flex: !isMobile }">
                    <div
                        class="flex flex-col h-full justify-around"
                        :class="{ 'w-1/3': !isMobile }"
                    >
                        <div class="flex">
                            <div
                                class="text-[#666666] flex-none w-[70px]"
                                style="
                                    text-align: justify;
                                    text-align-last: justify;
                                "
                            >
                                昵称
                            </div>
                            <span>:</span>
                            <div class="ml-2">{{ userInfo.nickname }}</div>
                            <ClientOnly>
                                <PopoverInput
                                    class="inline-block"
                                    @confirm="
                                        setUserInfo(
                                            $event,
                                            UserFieldEnum.NICKNAME
                                        )
                                    "
                                    :limit="30"
                                    show-limit
                                >
                                    <ElButton link>
                                        <Icon name="el-icon-Edit" :size="16" />
                                    </ElButton>
                                </PopoverInput>
                            </ClientOnly>
                        </div>
                        <div class="flex">
                            <div
                                class="text-[#666666] flex-none w-[70px]"
                                style="
                                    text-align: justify;
                                    text-align-last: justify;
                                "
                            >
                                ID
                            </div>
                            <span>:</span>
                            <div class="ml-2">{{ userInfo.sn }}</div>
                            <ElButton @click="toCopy(userInfo.sn)" link>
                                <Icon name="el-icon-CopyDocument" :size="16" />
                            </ElButton>
                        </div>
                    </div>
                    <div
                        :class="{ 'w-1/3': !isMobile }"
                        class="flex flex-col h-full justify-around"
                    >
                        <div class="flex">
                            <div
                                class="w-[70px] text-[#666666] flex-none"
                                style="
                                    text-align: justify;
                                    text-align-last: justify;
                                "
                            >
                                性别
                            </div>
                            <span>:</span>
                            <div class="ml-2">{{ userInfo.sex || '-' }}</div>
                            <ClientOnly>
                                <PopoverInput
                                    class="inline-block"
                                    type="select"
                                    :teleported="false"
                                    :options="[
                                        {
                                            label: '未知',
                                            value: 0
                                        },
                                        {
                                            label: '男',
                                            value: 1
                                        },
                                        {
                                            label: '女',
                                            value: 2
                                        }
                                    ]"
                                    @confirm="
                                        setUserInfo($event, UserFieldEnum.SEX)
                                    "
                                >
                                    <ElButton link>
                                        <Icon name="el-icon-Edit" :size="16" />
                                    </ElButton>
                                </PopoverInput>
                            </ClientOnly>
                        </div>
                        <div class="flex">
                            <div
                                class="w-[70px] text-[#666666] flex-none"
                                style="
                                    text-align: justify;
                                    text-align-last: justify;
                                "
                            >
                                手机号码
                            </div>
                            <span>:</span>
                            <div class="ml-2">{{ userInfo.mobile || '-' }}</div>
                            <ElButton
                                class="ml-2"
                                link
                                type="primary"
                                @click="changeMobile"
                            >
                                {{
                                    userInfo.mobile
                                        ? '更换手机号'
                                        : '绑定手机号'
                                }}
                            </ElButton>
                        </div>
                    </div>
                    <div
                        :class="{ 'w-1/3': !isMobile }"
                        class="flex flex-col h-full justify-around"
                    >
                        <div class="flex">
                            <div
                                class="w-[70px] text-[#666666] flex-none"
                                style="
                                    text-align: justify;
                                    text-align-last: justify;
                                "
                            >
                                邮箱账号
                            </div>
                            <span>:</span>
                            <div class="ml-2">{{ userInfo.email || '-' }}</div>
                            <ElButton
                                class="ml-2"
                                link
                                type="primary"
                                @click="changeEmail"
                            >
                                {{ userInfo.email ? '更换邮箱' : '绑定邮箱' }}
                            </ElButton>
                        </div>
                        <div class="flex w-full">
                            <div
                                class="w-[70px] text-[#666666] flex-none"
                                style="
                                    text-align: justify;
                                    text-align-last: justify;
                                "
                            >
                                注册时间
                            </div>
                            <span>:</span>
                            <div class="ml-2 flex-1">
                                {{ userInfo.create_time }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="mt-4">
            <el-tabs v-model="tabActiveName" @tabChange="tabChange">
                <el-tab-pane
                    v-for="(item, index) in tabList"
                    :key="index"
                    :label="item.label"
                    :name="item.name"
                >
                    <!-- <component :is="item.component"></component> -->
                </el-tab-pane>
            </el-tabs>
            <NuxtPage></NuxtPage>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {
    ElCard,
    ElImage,
    ElTabs,
    ElTabPane,
    ElAvatar,
    ElButton
} from 'element-plus'
import { getUserInfo, userEdit } from '@/api/user'
import {
    useAccount,
    PopupTypeEnum
} from '@/layouts/components/account/useAccount'
const { setPopupType, toggleShowPopup, showPopup } = useAccount()
import { copy } from '@/utils/util'
import { useAppStore } from '@/stores/app'
import loginOutIcon from '@/assets/images/icon/login_out.png'
import { useUserStore } from '@/stores/user'

const { isMobile } = useAppStore()
const userStore = useUserStore()

const { data: userInfo, refresh } = await useAsyncData(() => getUserInfo(), {
    initialCache: false
})

// const {  getUser } = useUserStore()

const router = useRouter()
const route = useRoute()

const tabActiveName = ref('wallet')

const tabList = reactive([
    {
        label: '我的钱包',
        name: '/generate/user/wallet'
    },
    {
        label: '分销推广',
        name: '/generate/user/distribution'
    },
    {
        label: '购买记录',
        name: '/generate/user/buy_record'
    },
    {
        label: '充值记录',
        name: '/generate/user/recharge_record'
    },
    {
        label: '密码管理',
        name: '/generate/user/password'
    }
])

const tabChange = (i: any) => {
    router.push(i)
}

// 用户资料
enum UserFieldEnum {
    NONE = '',
    AVATAR = 'avatar',
    USERNAME = 'account',
    NICKNAME = 'nickname',
    SEX = 'sex'
}

const setUserInfo = async (
    value: string,
    type: UserFieldEnum
): Promise<void> => {
    await userEdit({
        field: type,
        value: value
    })
    refresh()
}

watch(showPopup, (value) => {
    if (!value) {
        refresh()
    }
})

const changeMobile = () => {
    setPopupType(PopupTypeEnum.BIND_MOBILE)
    toggleShowPopup(true)
}

const toCopy = async (value: string) => {
    await copy(value)
}

const loginOut = async () => {
    await feedback.confirm('确定退出登录吗？')
    userStore.logout()
}

//修改邮箱
const changeEmail = () => {
    setPopupType(PopupTypeEnum.BIND_EMAIL)
    toggleShowPopup(true)
}

watch(
    () => route.path,
    (value) => {
        const index = tabList.findIndex((item) => value.includes(item.name))
        tabActiveName.value = tabList[index].name
    },
    {
        immediate: true
    }
)

definePageMeta({
    auth: true
})
</script>

<style lang="scss" scoped>
.userTitle {
    &::before {
        content: '';
        position: absolute;
        width: 5px;
        height: 100%;
        background: var(--el-color-primary);
    }
}
.avatar {
    @apply relative flex cursor-pointer;
    .change-btn {
        display: none;
        height: 50%;
        line-height: 30px;
        @apply absolute bg-[rgba(0,0,0,0.5)]  w-full text-center bottom-0 rounded-b-full;
    }
    &:hover {
        .change-btn {
            display: block;
        }
    }
}
</style>
