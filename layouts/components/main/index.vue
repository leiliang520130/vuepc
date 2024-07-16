<template>
    <div>
        <div
            v-if="sidebar.length"
            class="mr-4 bg-white rounded-[8px] overflow-hidden"
        >
            <Menu
                :menu="sidebar"
                :default-active="activeMenu"
                mode="vertical"
            />
        </div>
        <main class="mx-auto w-[1200px] main">
            <div
                :class="[
                    'layout-page flex-1 min-w-0 rounded-[8px]',
                    {
                        'bg-body': hasSidebar
                    }
                ]"
            >
                <slot />
            </div>
        </main>
    </div>
</template>
<script lang="ts" setup>
import Menu from '../menu/index.vue'
const route = useRoute()
const activeMenu = computed<string>(() => route.meta.activeMenu ?? route.path)
const { sidebar, hasSidebar } = useMenu()
</script>

<style scoped lang="scss"></style>
