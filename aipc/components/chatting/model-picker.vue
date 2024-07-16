<template>
    <div class="flex items-center py-[10px]">
        <template v-if="chatModel.modelList.length">
            <template v-if="chatModel.billing_is_open * 1">
                <el-select
                    class="flex-1 w-[120px] min-w-[120px] mr-2"
                    v-model="modelListValue"
                    placement="top"
                    filterable
                    @change="handleChangeModelList"
                >
                    <template #prefix v-if="chatModel.currentModel.image">
                        <image-contain
                            :src="chatModel.currentModel.image"
                            width="20px"
                            height="20px"
                        ></image-contain>
                    </template>
                    <el-option
                        v-for="item in chatModel.modelList"
                        :value="item.key"
                        :label="item.alias || item.name"
                        :key="item.key"
                    />
                </el-select>
                <el-select
                    class="flex-1 min-w-[180px]"
                    v-model="value"
                    placement="top"
                    filterable
                    @change="handleChangeModel"
                >
                    <el-option
                        v-for="item in chatModel.currentModel.model_list"
                        :value="item.key"
                        :label="item.alias"
                        :key="item.key"
                    />
                </el-select>
            </template>
            <!--    因为在创作中位置宽度不够放，则隐藏消耗条数，将其放到生成按钮里面    -->
            <template v-if="!isCreate">
                <div
                    class="ml-[10px] text-xs text-[#999999]"
                    v-if="!chatModel?.current?.member_free"
                >
                    <span v-if="chatModel?.current?.balance">
                        消耗
                        <span class="text-primary">{{
                            chatModel?.current?.balance
                        }}</span>
                        条对话次数
                    </span>

                    <div class="text-xs text-[#999999]" v-else>免费</div>
                </div>

                <div class="ml-[10px] text-xs text-[#999999]" v-else>
                    会员免费
                </div>
            </template>
        </template>
    </div>
</template>
<script setup lang="ts">
import { getChatModelApi } from '@/api/chat'
import { useUserStore } from '~/stores/user'
import { useVModel } from '@vueuse/core'

const userStore = useUserStore()
const emit = defineEmits(['update:modelValue', 'update:model'])

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    isCreate: {
        type: Boolean,
        default: false
    }
})
const value = useVModel(props, 'modelValue', emit)
const modelListValue = ref<string>('')

// 聊天模型数据
const chatModel = reactive({
    billing_is_open: 0,
    current: {
        balance: 1,
        key: '',
        member_free: false,
        model: '',
        default: false
    } as any,
    currentModel: {
        key: '',
        model: '',
        model_list: [],
        default: false
    } as any,
    modelList: [] as any[]
})

// 获取聊天模型数据
const getChatModelFunc = async () => {
    try {
        const { billing_is_open, model_list: data } = await getChatModelApi()
        chatModel.billing_is_open = billing_is_open
        chatModel.modelList = data
        chatModel.currentModel =
            data.find((item: any) => item.default) || data[0]
        chatModel.current =
            chatModel.currentModel.model_list.find(
                (item: any) => item.default
            ) || chatModel.currentModel.model_list[0]

        modelListValue.value = chatModel.currentModel?.key || ''
        value.value = chatModel.current?.key || ''
        emit('update:model', chatModel.current)
    } catch (error) {
        console.log('获取聊天模型数据错误=>', error)
    }
}

const handleChangeModelList = (key: string) => {
    chatModel.currentModel = chatModel.modelList.find(
        (item: any) => item.key == key
    )
    chatModel.current = chatModel.currentModel.model_list[0]
    value.value = chatModel.current?.key
    emit('update:model', chatModel.current)
}

const handleChangeModel = (key: string) => {
    chatModel.current = chatModel.currentModel.model_list.find(
        (item: any) => item.key == key
    )
    emit('update:model', chatModel.current)
}

getChatModelFunc()
</script>
