<template>
    <section
        class="layout-default bg-gradient-to-br from-primary-light-9 from-30% via-white via-40% to-white to-90%"
        :class="{
            'min-w-[1200px]': !appStore.isMobile
        }"
    >
        <LayoutHeader />

        <div class="main-contain">
            <slot name="Title"></slot>
            <LayoutMain class="flex-1 min-h-0 flex">
                <slot v-if="userStore.isLogin || !$route.meta.auth" />
                <ToLogin class="h-full" v-else />
            </LayoutMain>
            <slot name="guide"></slot>

            <LayoutFooter />
            <UserPop ref="userPopRef"></UserPop>
            <Float></Float>
        </div>
        <Account />
    </section>
</template>
<script lang="ts" setup>
import LayoutHeader from './components/header/index.vue'
import LayoutMain from './components/main/index.vue'
import LayoutFooter from './components/footer/index.vue'
import Account from './components/account/index.vue'
import Float from './components/float/index.vue'
import { useUserStore } from '~~/stores/user'
import { useAppStore } from '~~/stores/app'
import ToLogin from './components/account/to-login.vue'
const userStore = useUserStore()
const appStore = useAppStore()

const userPopRef = shallowRef()

watch(
    () => appStore.showUserPop,
    (value) => {
        if (value) {
            userPopRef.value.open()
        }
        console.log(value)
    }
)

watch(
    () => appStore.isMobile,
    () => {
        console.log('change')
    }
)
</script>
<style lang="scss" scoped>
.main-contain {
    min-height: calc(100vh - var(--header-height));
    @apply flex flex-col;
}
</style>
