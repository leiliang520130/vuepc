<template>
    <NuxtLayout name="generate">
        <template #siderBar>
            <div class="py-[15px] h-full siderBar">
                <el-scrollbar height="100%" ref="scrollRef">
                    <div
                        :id="`item-${item.id}`"
                        v-for="(item, index) in categoryData"
                        :key="index"
                        class="flex items-center px-[20px] py-[10px] cursor-pointer mt-[10px] item rounded-md"
                        :class="{ isSelect: currentId == item.id }"
                        @click="selectCategory(item.id)"
                    >
                        <el-image
                            :src="item.image"
                            class="w-[20px] h-[20px] flex-none"
                        ></el-image>
                        <div class="ml-2 line-clamp-2">{{ item.title }}</div>
                    </div>
                </el-scrollbar>
            </div>
        </template>
        <NuxtPage></NuxtPage>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { ElImage, ElScrollbar } from 'element-plus'
import { useAppStore } from '~~/stores/app'
import { getWriteCategory } from '~/api/generate'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const scrollRef = shallowRef()

//选中分类
const currentId = ref<any>()
//获取分类数据
const { data: categoryData } = useAsyncData(() => getWriteCategory(), {
    transform: (value) => {
        // if (!route.params.id) {
        //     selectCategory(value[0].id)
        // } else {
        if (route.params.id) {
            selectCategory(Number(route.params.id))
            // const dom = document.getElementById(`item-${route.params.id}`)
            // console.log(dom)
        }
        // }
        return value
    }
})

const selectCategory = (id: number) => {
    router.push({
        path: `/generate/${id}`
    })
    currentId.value = id
}

onMounted(() => {
    if (!appStore.isMobile) {
        const dom = document.getElementById(`item-${route.params.id}`)
        scrollRef.value.setScrollTop(
            (dom?.getClientRects()[0].y as number) - 300
        )
    }
})

definePageMeta({
    layout: false
    // auth: true
})
</script>

<style scoped lang="scss">
.siderBar {
    .item {
        transition: all 0.2s;
        &:hover {
            background: var(--el-color-primary-light-8);
            color: var(--el-color-primary);
        }
    }
    .isSelect {
        background: var(--el-color-primary-light-8);
        color: var(--el-color-primary);
    }
}
</style>
