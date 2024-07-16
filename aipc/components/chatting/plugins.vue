<template>
    <div class="chat-plugins mr-2" v-if="plugins.length">
        <el-popover
            placement="top-start"
            trigger="hover"
            width="200"
            v-model:visible="visible"
        >
            <div>
                <div>
                    <div
                        v-for="item in plugins"
                        :key="item.key"
                        class="flex items-center justify-between mb-[15px] cursor-pointer"
                        @click="handleClick(item)"
                    >
                        <img
                            :src="item.icon"
                            class="w-[13px] h-[13px] mr-2 flex-none"
                        />
                        <div class="flex-1 min-w-0">
                            <span>{{ item.name }}</span>
                        </div>
                        <div
                            class="flex text-primary"
                            v-if="currentId === item.key"
                        >
                            <Icon name="el-icon-SuccessFilled" :size="18" />
                        </div>
                    </div>
                </div>
            </div>
            <template #reference>
                <div
                    class="flex items-center px-[15px] py-[5px] border border-solid border-br-light rounded max-w-[300px] cursor-pointer"
                >
                    <img
                        src="@/assets/images/chat_plugins/plugins.png"
                        class="w-[15px] h-[15px] flex-none"
                    />
                    <span class="ml-1 line-clamp-1 leading-5">
                        {{
                            currentPlugin.key ? currentPlugin.name : '插件管理'
                        }}
                    </span>
                </div>
            </template>
        </el-popover>
        <div v-if="currentPlugin.key">
            <div
                class="ml-[10px] text-xs text-[#999999]"
                v-if="!currentPlugin.member_free"
            >
                <span v-if="currentPlugin.balance">
                    消耗
                    <span class="text-primary">{{
                        currentPlugin.balance
                    }}</span>
                    条对话次数
                </span>

                <div class="text-xs text-[#999999]" v-else>免费</div>
            </div>

            <div class="ml-[10px] text-xs text-[#999999]" v-else>会员免费</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from '@vueuse/core'
// icon
import iconUnUse from '@/assets/images/chat_plugins/unuse.png'

import { getPlugLists } from '@/api/chat'
const props = withDefaults(
    defineProps<{
        modelValue: number | string
    }>(),
    {
        modelValue: ''
    }
)

const emit = defineEmits<{
    (event: 'update:modelValue', id: number | string): void
}>()
const visible = ref(false)
const plugins = ref<any[]>([])
const currentId = useVModel(props, 'modelValue', emit)
const handleClick = (row: { key: string }) => {
    currentId.value = row.key
    visible.value = false
}

const currentPlugin = computed(() => {
    return plugins.value.find((item) => item.key === currentId.value) || {}
})

const getData = async () => {
    const data = await getPlugLists()
    if (data.length) {
        plugins.value = [
            {
                name: '不使用插件',
                key: '',
                icon: iconUnUse,
                balance: 0
            },
            ...data
        ]
    }
}
getData()
</script>

<style lang="scss" scoped>
.chat-plugins {
    position: relative;
    width: auto;
    display: flex;
    align-items: center;
    &__content {
        inset: auto auto 130% 0%;
        position: absolute;
        left: 0;
        flex: 1;
        width: 100vw;
        white-space: pre;
        z-index: 999;
        @apply bg-white;
    }
}
</style>
