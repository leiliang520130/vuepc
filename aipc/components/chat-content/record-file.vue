<template>
    <div
        v-if="url"
        class="flex mb-[6px] bg-white rounded-[5px] p-[10px] max-w-[300px] items-center cursor-pointer"
        @click="onPreview"
    >
        <el-image class="flex-none w-[40px] h-[40px]" :src="icon_doc" />
        <div
            class="line-clamp-2 text-main flex-1 min-w-0 ml-[6px] text-black"
            :style="{
                'word-break': 'break-word'
            }"
        >
            {{ name }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import icon_doc from '@/assets/images/icon/icon_doc.png'
const props = defineProps<{
    url: string
    name: string
}>()

const onPreview = async () => {
    window.open(props.url, '_blank')
}
</script>
