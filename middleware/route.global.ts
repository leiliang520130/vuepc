import { useAppStore } from '~~/stores/app'
import { useUserStore } from '~~/stores/user'
import { isEmptyObject } from '~~/utils/validate'
import {
    PopupTypeEnum,
    useAccount
} from '@/layouts/components/account/useAccount'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore()
    const appStore = useAppStore()
    if (to.query.user_sn) {
        const user_sn: any = useCookie('user_sn')
        user_sn.value = to.query.user_sn
        userStore.checkShare()
    }
    const { setPopupType, toggleShowPopup } = useAccount()
    try {
        if (isEmptyObject(appStore.config)) {
            await appStore.getConfig()
            await appStore.toGetRechargeConfig()
        }
        if (userStore.isLogin && isEmptyObject(userStore.userInfo)) {
            await userStore.getUser()
        }
        if (to.meta.auth && !userStore.isLogin) {
            setPopupType(PopupTypeEnum.LOGIN)
            toggleShowPopup(true)
            return abortNavigation()
        }
    } catch (error) {
        userStore.$reset()
    }
})
