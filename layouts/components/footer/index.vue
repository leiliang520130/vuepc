<template>
    <footer class="layout-footer text-center bg-[#222222] py-[30px]">
        <div class="text-[#bebebe]">
            <!-- <NuxtLink> 关于我们 </NuxtLink>
            ｜ -->
            <NuxtLink :to="`/policy/${PolicyAgreementEnum.SERVICE}`">
                用户协议
            </NuxtLink>
            ｜
            <NuxtLink :to="`/policy/${PolicyAgreementEnum.PRIVACY}`">
                隐私政策
            </NuxtLink>
            <!-- ｜
            <NuxtLink to="/user/info"> 会员中心 </NuxtLink> -->
        </div>
        <div class="mt-4 text-tx-secondary flex items-center justify-center">
            <a
                class="mx-1 hover:underline flex ml-2"
                :href="item.value"
                target="_blank"
                v-for="item in appStore.getCopyrightConfig"
                :key="item.key"
            >
                <img
                    v-if="item.icon"
                    :src="item.icon"
                    class="h-[16px] mr-[4px]"
                    alt=""
                />
                {{ item.key }}
            </a>
        </div>
    </footer>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { PolicyAgreementEnum } from '@/enums/appEnums'
const appStore = useAppStore()
</script>

<style lang="scss" scoped></style>
