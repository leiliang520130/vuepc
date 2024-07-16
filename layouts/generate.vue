<template>
    <el-container
        class="layout-app bg-page h-full"
        :style="[{ height: `${windowHeight}px` }]"
    >
        <el-header v-if="appStore.isMobile">
            <LayoutHeader :show-drawer="true"></LayoutHeader>
        </el-header>

        <ElContainer>
            <el-aside width="200px" v-if="!appStore.isMobile">
                <genSiderBar>
                    <slot name="siderBar"></slot>
                </genSiderBar>
            </el-aside>
            <el-drawer
                v-if="appStore.isMobile"
                :with-header="false"
                v-model="showPanelDrawer"
                direction="ltr"
                size="50%"
            >
                <genSiderBar>
                    <slot name="siderBar"></slot>
                </genSiderBar>
            </el-drawer>
            <div
                class="bg-gradient-to-br from-primary-light-9 from-10% via-white via-50% to-white to-90% w-full"
            >
                <el-scrollbar ref="scrollbarRef">
                    <el-main>
                        <slot :scrollRef="scrollbarRef"></slot>
                    </el-main>
                </el-scrollbar>
            </div>
        </ElContainer>
    </el-container>
    <UserPop v-if="userStore.isLogin" ref="userPopRef"></UserPop>
    <Account></Account>
    <float></float>
</template>

<script setup lang="ts">
import {
    ElContainer,
    ElAside,
    ElMain,
    ElScrollbar,
    ElHeader,
    ElDrawer
} from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import genSiderBar from './components/gen_siderBar/index.vue'
import Account from './components/account/index.vue'
import LayoutHeader from './components/header/index.vue'
import float from './components/float/index.vue'
import { useAppStore } from '~~/stores/app'
import { useUserStore } from '~~/stores/user'
import { setData } from '@/pages/generate/_hook/scroll'

const scrollbarRef = shallowRef()

const appStore = useAppStore()
const userStore = useUserStore()
const userPopRef = shallowRef()
const isMobile = computed(() => appStore.isMobile)
const showPanelDrawer = computed({
    get() {
        return !appStore.isCollapsed && isMobile.value
    },
    set(value) {
        appStore.toggleCollapsed(!value)
    }
})

watch(
    () => appStore.showUserPop,
    (value) => {
        if (value) {
            userPopRef.value.open()
        }
    }
)

const { height: windowHeight } = useWindowSize({
    includeScrollbar: false
})

onMounted(async () => {
    setData(scrollbarRef.value)
})
</script>

<style scoped lang="scss">
:deep(.el-header) {
    padding: 0;
}
</style>
