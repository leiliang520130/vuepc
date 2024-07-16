<template>
    <div>
        <div class="inline-block" @click="showPopup = true">
            <slot name="trigger" />
        </div>
        <ElDialog v-model="showPopup" title="分销海报" show-close width="400px">
            <div class="flex justify-center" style="height: 600px">
                <div
                    ref="posterRef"
                    class="poster overflow-hidden"
                    v-if="!loading"
                >
                    <div class="poster-bg flex flex-col">
                        <img class="w-full h-full" :src="getPosterBg" alt="" />
                    </div>

                    <div class="w-full h-full poster-contain1">
                        <div
                            class="absolute z-10 bg-white"
                            :style="{
                                top: `${drawOptions?.code?.y}px`,
                                left: `${drawOptions?.code?.x}px`
                            }"
                        >
                            <QrcodeVue
                                :value="inviteLink"
                                :size="100"
                                :margin="1"
                            />
                        </div>

                        <span
                            v-if="drawOptions.showData"
                            class="text-white absolute z-10"
                            :style="{
                                top: `${drawOptions?.data?.y}px`,
                                left: `${drawOptions?.data?.x}px`
                            }"
                        >
                            {{ drawOptions?.data?.content }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-[10px]">
                <el-button round @click="download" :loading="downloadLoading">
                    <template #icon>
                        <Icon name="el-icon-Download" />
                    </template>
                    下载
                </el-button>
                <el-button round @click="copy(pcLink)">
                    <template #icon>
                        <Icon name="el-icon-DocumentCopy" />
                    </template>
                    复制链接
                </el-button>
            </div>
        </ElDialog>
    </div>
</template>
<script lang="ts" setup>
import { getdecorate } from '~/api'
import { useAppStore } from '~/stores/app'
import { useUserStore } from '~/stores/user'
import QrcodeVue from 'qrcode.vue'
import { reactive } from 'vue'
const appStore = useAppStore()
const { getImageUrl, config } = appStore
const showPopup = ref(false)
const downloadLoading = ref(false)
const drawOptions = ref<any>({})
const loading = ref(false)
const userStore = useUserStore()
const posterRef = shallowRef<HTMLDivElement>()

const getData = async () => {
    loading.value = true
    try {
        const { data } = await getdecorate({ id: 5 })
        drawOptions.value = JSON.parse(data)[0]?.content || {}
    } finally {
        loading.value = false
    }
}

const inviteLink = computed(
    () => `${window.origin}/mobile?user_sn=${userStore.userInfo.sn}`
)

const getPosterBg = computed(() => {
    const data = drawOptions.value
    if (data.default == 1 && data.poster == 1) {
        // 默认海报1
        return getImageUrl(data.defaultUrl1)
    } else if (data.default == 1 && data.poster == 2) {
        // 默认海报2
        return getImageUrl(props?.options.defaultUrl2)
    } else if (data.default == 2) {
        // 自定义海报
        return getImageUrl(data.posterUrl)
    }
})
const { copy } = useCopy()
const pcLink = computed(
    () => `${window.origin}/?user_sn=${userStore.userInfo.sn}`
)

const download = async () => {
    try {
        downloadLoading.value = true
        await downloadHtml2Image(posterRef.value)
    } catch (error) {
        feedback.msgError('下载失败，请重试')
    } finally {
        downloadLoading.value = false
    }
}

getData()
</script>

<style lang="scss" scoped>
.poster {
    width: 270px;
    position: relative;
    overflow: hidden;
    height: 450px;
    transform: scale(calc(360 / 270));
    transform-origin: center top;
    &-bg {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    background: transparent;
}

.poster-contain1 {
    position: relative;
    z-index: 1;
    background-color: transparent;
}
</style>
