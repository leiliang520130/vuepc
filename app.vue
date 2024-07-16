<script lang="ts" setup>
import { ID_INJECTION_KEY, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useAppStore } from './stores/app'
import { useThemeStore } from './stores/theme'
import { ScreenEnum } from './enums/appEnums'
import { useWindowSize, watchThrottled } from '@vueuse/core'
import { addVisit } from './api/index'
provide(ID_INJECTION_KEY, {
    prefix: 100,
    current: 0
})
const config = {
    locale: zhCn
}
const router = useRouter()
const appStore = useAppStore()
const themeStore = useThemeStore()
themeStore.getTheme()
const { pc_title, pc_ico, pc_keywords, pc_desc } = appStore.getWebsiteConfig
useHead({
    title: pc_title,
    meta: [
        { name: 'description', content: pc_desc },
        { name: 'keywords', content: pc_keywords }
    ],
    link: [
        {
            rel: 'icon',
            href: pc_ico
        }
    ]
})

const { width } = useWindowSize()
watchThrottled(
    width,
    (value) => {
        if (value > ScreenEnum.SM) {
            appStore.setMobile(false)
            appStore.toggleCollapsed(false)
        } else {
            appStore.setMobile(true)
            appStore.toggleCollapsed(true)
        }
    },
    {
        immediate: true
    }
)

useAsyncData(() => addVisit({ terminal: getClient() }))

if (!appStore.getIsInstall) {
    await router.replace({ path: '/install/install.php' })
    window.location.replace('/install/install.php')
}


</script>
<template>
    <ElConfigProvider v-bind="config">
        <NuxtLayout>
            <NuxtLoadingIndicator color="#4a5dff" :height="2" />
            <NuxtPage />
        </NuxtLayout>
    </ElConfigProvider>
</template>
