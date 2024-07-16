<template>
    <NuxtLink v-if="appStore.getWebsiteConfig.pc_logo" class="flex" to="/">
        <div
            class="flex items-center justify-start w-full py-[16px] mx-[10px] border-b border-solid border-br-extra-light"
        >
            <img
                class="w-[26px] h-[26px]"
                :src="appStore.getWebsiteConfig.pc_logo"
            />

            <div
                class="ml-[10px] font-bold text-[16px] text-left"
            >
                {{ appStore.getWebsiteConfig.pc_title }}
            </div>
        </div>
    </NuxtLink>
</template>
<script lang="ts" setup>
import { useAppStore } from '~~/stores/app'
const appStore = useAppStore()
</script>

<style lang="scss" scoped></style>
