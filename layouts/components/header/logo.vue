<template>
    <NuxtLink
        v-if="appStore.getWebsiteConfig.pc_logo"
        class="flex items-center"
        to="/"
    >
        <img
            :src="appStore.getWebsiteConfig.pc_logo"
            class="max-h-[34px] max-w-[200px] object-cover"
        />
        <div class="text-black font-semibold ml-2 text-[16px] truncate">
            {{ appStore.getWebsiteConfig.pc_title }}
        </div>
    </NuxtLink>
</template>
<script lang="ts" setup>
import { useAppStore } from '~~/stores/app'
const appStore = useAppStore()
</script>

<style lang="scss" scoped></style>
