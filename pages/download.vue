<template>
    <div v-if="isWeixinClient() && isAndroid()" class=" text-center mt-[200px]">微信环境下暂不支持下载，请在右上角打开浏览器进行下载！</div>
</template>

<script setup lang="ts">
import { isWeixinClient, isAndroid } from '@/utils/client'
const route = useRoute()

const url = route.query.path as any

onMounted(() => {
    if (isWeixinClient() && isAndroid()) {
        return
    }
    console.log(url);

    window.location.href = `${url}&wx=${isWeixinClient() ? 1 : 0}`
})

</script>

<style scoped lang="scss"></style>