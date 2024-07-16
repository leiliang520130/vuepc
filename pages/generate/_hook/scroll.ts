import { ElScrollbar } from 'element-plus'
import { useAppStore } from '@/stores/app'

const scrollRef = ref<InstanceType<typeof ElScrollbar>>()

export const setData = (ref: InstanceType<typeof ElScrollbar>) => {
    scrollRef.value = ref
}

export const Scroll = (top: number) => {
    const { isMobile } = useAppStore()
    if (isMobile) {
        window.scroll({ top, left: 0 })
    } else {
        scrollRef.value?.setScrollTop(top)
    }
}
