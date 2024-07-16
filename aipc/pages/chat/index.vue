<template>
    <div>
        <NuxtLayout name="default">
            <template #panel>
                <TheSession />
            </template>
            <div class="h-full flex">
                <Chatting
                    ref="chattingRef"
                    v-model:model="chatParams.model"
                    v-model:network="chatParams.network"
                    v-model:plugin="plugins"
                    :content-list="chatContentList"
                    :send-disabled="isReceiving"
                    :selectval="sessionActive"
                    :avatar="appStore.config.chat.chat_logo"
                    :chat-type="1"
                    @close="chatClose"
                    @content-post="contentPost"
                    @clean-chat-log="cleanChatLog"
                    @top="handleTop"
                >
                    <div
                        class="h-[40px] py-[10px] text-[#999] text-center cursor-pointer"
                        @click.stop="handleTop"
                    >
                        <template
                            v-if="hasMoreDialogueRecords && userStore.isLogin"
                        >
                            {{
                                dialogueRecordsLoading
                                    ? '正在加载中...'
                                    : '-- 点击加载 --'
                            }}
                        </template>
                    </div>
                    <div v-if="!chatContentList.length" class="px-[50px]">
                        <div
                            class="my-[60px] text-center text-[30px] font-medium"
                        >
                            {{ appStore.getChatConfig.chat_title }}
                        </div>
                        <ProblemExample @click-item="contentPost" />
                    </div>
                </Chatting>
            </div>
            <TheGuidedPopup ref="guidedPopupRef" />
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
import { getchatLog, samplesLists, cleanChat, chatSendText } from '@/api/chat'
import { useUserStore } from '~~/stores/user'
import feedback from '~~/utils/feedback'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '~/stores/app'
import { isNewDay } from '~/utils/validate'
import { CHAT_LIMIT_KEY } from '~/enums/cacheEnums'
import { watch } from 'vue'
import ProblemExample from './_components/problem-example.vue'
const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
//对话记录列表

//对话框ref
const chattingRef = ref(null)
const guidedPopupRef = shallowRef()
const chatParams = reactive({
    model: '',
    network: false
})

const plugins = reactive({
    type: '',
    id: '',
    file: {} as any
})

const resetPluginData = () => {
    plugins.file = { url: '' }
}

watch(
    () => plugins.id,
    (val) => {
        if (val == 'gpt-4-all') {
            resetPluginData()
        }
    }
)
const {
    sessionActive,
    sessionAdd,
    currentSession,
    sessionEdit,
    getSessionLists
} = await useSessionList()

await useAsyncData(() => getSessionLists(), {
    default() {
        return []
    },
    immediate: true
})

const chatContentList = ref<any[]>([])
const chatLogParams = reactive({
    type: 1,
    category_id: sessionActive.value,
    page_type: 1,
    page_no: 1,
    page_size: 15
})
const hasMoreDialogueRecords = ref<boolean>(false)
const dialogueRecordsLoading = ref<boolean>(false)

/**
 * 1.上拉加载
 * 2.切换分类时重制上拉
 * 3.对话以后加载(最新一条就行)
 * flag = 1的时候表示对话结束了，获取最新一条数据
 **/
let contentListHeight = 0 // 旧记录高度，新记录高度 - 旧记录高度得到最新刷新定位位置
//获取聊天记录
const getChatList = async (flag?: boolean) => {
    dialogueRecordsLoading.value = true
    hasMoreDialogueRecords.value = true
    try {
        const chatElement = document.getElementsByClassName('contentList')[0]
        const data = await getchatLog({
            ...chatLogParams,
            page_no: flag ? 1 : chatLogParams.page_no,
            page_size: flag ? 1 : chatLogParams.page_size
        })

        const { page_no, page_size } = chatLogParams
        if (
            page_no * page_size > data.count ||
            chatContentList.value.length / 2 >= data.count
        ) {
            hasMoreDialogueRecords.value = false
        }

        const transformData = data.lists.map((item: any) => {
            if (item.type == 1) {
                return { ...item, from_avatar: userStore.userInfo.avatar }
            } else {
                return {
                    ...item,
                    from_avatar: appStore.config.chat.chat_logo
                }
            }
        })

        if (flag) {
            chatContentList.value.splice(-2, 2)
            chatContentList.value = [...chatContentList.value, ...transformData]
        } else {
            chatContentList.value = [...transformData, ...chatContentList.value]
        }

        // 刷新记录时将滚动条定位到刷新之前的元素那里
        await nextTick()
        if (currentSession.value == '新的会话') {
            chatContentList.value = []
            return
        }
        const rect = Object.freeze(chatElement?.getBoundingClientRect())
        if (rect && contentListHeight) {
            chattingRef.value?.scrollTo(rect.height - contentListHeight)
        }
        contentListHeight = rect.height
    } catch (e) {
        console.log('聊天记录错误', e)
    } finally {
        dialogueRecordsLoading.value = false
    }
}

const handleTop = () => {
    if (hasMoreDialogueRecords.value && contentListHeight) {
        chatLogParams.page_no += 1
        getChatList()
    }
}

const { pauseAll } = useAudioPlay()
const isReceiving = ref(false)
const newUserInput = ref<string>('')
//发送问题
const contentPost = async (userInput: any) => {
    if (!userStore.isLogin) return userStore.toggleShowLogin(true)

    if (isReceiving.value) return
    isReceiving.value = true
    if (userStore.userInfo.is_chat_limit && isNewDay(true, CHAT_LIMIT_KEY)) {
        try {
            await ElMessageBox.confirm(
                '已超过会员对话上限次数，继续对话将会消耗账户的对话余额',
                '对话上限提示',
                {
                    showClose: false,
                    confirmButtonText: '继续',
                    cancelButtonText: '关闭'
                }
            )
        } catch (e) {
            isReceiving.value = false
            return
        }
    }
    if (sessionActive.value === 0) {
        await sessionAdd()
    }
    if (currentSession.value === '新的会话') {
        await sessionEdit(sessionActive.value, userInput)
    }
    newUserInput.value = userInput
    chatContentList.value.push({
        type: 1,
        content: userInput,
        from_avatar: userStore.userInfo.avatar,
        file_url: plugins.file.url,
        file_name: plugins.file.name,
        file_type: plugins.type == '' ? 0 : plugins.type == 'image' ? 1 : 2
    })
    const result = reactive({
        type: 2,
        loading: true,
        content: [],
        create_time: ' ',
        from_avatar: appStore.config.chat.chat_logo,
        id: ''
    })
    chatContentList.value.push(result)

    try {
        await chatSendText(
            {
                question: userInput,
                type: 1,
                other_id: sessionActive.value,
                ...chatParams,
                model: plugins.id ? plugins.id : chatParams.model,
                file: plugins.file.url
            },
            {
                onstart(reader) {
                    streamReader = reader
                    pauseAll()
                },
                onmessage(value) {
                    value
                        .trim()
                        .split('data:')
                        .forEach(async (text) => {
                            if (text !== '') {
                                try {
                                    const dataJson = JSON.parse(text)
                                    const {
                                        id: chatId,
                                        code,
                                        event,
                                        data,
                                        index,
                                        incremental
                                    } = dataJson
                                    if (event == 'error' && code === 101) {
                                        guidedPopupRef.value?.open()
                                    } else if (event == 'error') {
                                        feedback.msgError(data)
                                        chattingRef.value.setInput(
                                            newUserInput.value
                                        )
                                    }

                                    if (data) {
                                        if (!result.content[index]) {
                                            result.content[index] = ''
                                        }
                                        result.content[index] = incremental
                                            ? result.content[index] + data
                                            : data
                                    }

                                    if (event === 'finish') {
                                        result.loading = false
                                        if (plugins.id == 'gpt-4-all') {
                                            resetPluginData()
                                        }
                                        return
                                    }
                                } catch (error) {}
                            }
                        })
                },
                onclose() {
                    isReceiving.value = false
                    setTimeout(async () => {
                        await getChatList(true)
                        await nextTick()
                        chattingRef.value.scrollToBottom()
                    }, 600)
                    userStore.getUser()
                }
            }
        )
    } catch (error) {
        console.log(error)
        isReceiving.value = false
        chattingRef.value.setInput(newUserInput.value)
        chatContentList.value.splice(chatContentList.value.length - 2, 2)
    }

    nextTick(() => {
        chattingRef.value.scrollToBottom()
    })
}

let streamReader: ReadableStreamDefaultReader<Uint8Array> | null = null
const chatClose = (index?: number) => {
    streamReader?.cancel()
    if (index) {
        chatContentList.value[index].loading = false
    }
    isReceiving.value = false
}

//清空会话
const cleanChatLog = async () => {
    console.log()
    await feedback.confirm('确定清空对话？')
    await cleanChat({ type: 1, category_id: sessionActive.value })
    chatContentList.value = []
}

onMounted(async () => {
    if (route.query.cid || route.query.user_sn) {
        const cid: any = useCookie('cid')
        const user_sn: any = useCookie('user_sn')
        cid.value = route.query.cid
        user_sn.value = route.query.user_sn
        await nextTick()
        userStore.checkShare()
    }
    await getChatList()
    await nextTick()
    chattingRef.value.scrollToBottom()
})
watch(sessionActive, async (v1) => {
    // 切换对话重置分页数据 Start
    chatLogParams.category_id = v1
    chatLogParams.page_no = 1
    chatContentList.value = []
    contentListHeight = 0
    // 切换对话重置分页数据 End
    chatClose()
    await getChatList()
    await nextTick()
    chattingRef.value.scrollToBottom()
})

definePageMeta({
    layout: false
})
</script>
<style lang="scss" scoped>
.container-tip {
    border: 1px solid #fb9a3b;
}
.item {
    :hover {
        color: #fb9a3b;
    }
}
</style>
