import { defineStore } from 'pinia'
import { getConfig } from '~~/api/app'
import { getRechargeConfig } from '~/api/pay'

interface AppSate {
    config: Record<string, any>
    isMobile: boolean
    isCollapsed: boolean
    showUserPop: boolean
    rechargeConfig: Record<string, any>
}
export const useAppStore = defineStore({
    id: 'appStore',
    state: (): AppSate => ({
        config: {},
        isMobile: true,
        isCollapsed: false,
        showUserPop: false,
        rechargeConfig: {}
    }),
    getters: {
        getImageUrl: (state) => (url: string) =>
            url ? `${state.config.domain}${url}` : '',
        getWebsiteConfig: (state) => state.config.website || {},
        getLoginConfig: (state) => state.config.login || {},
        getCopyrightConfig: (state) => state.config.copyright || [],
        getQrcodeConfig: (state) => state.config.qrcode || {},
        getAdminUrl: (state) => state.config.admin_url,
        getCustomer: (state) => state.config.customer || {},
        getIsInstall: (state) => state.config.install || true
    },
    actions: {
        async getConfig() {
            const config = await getConfig()
            this.config = config
        },
        setMobile(value: boolean) {
            this.isMobile = value
        },
        toggleCollapsed(toggle?: boolean) {
            this.isCollapsed = toggle ?? !this.isCollapsed
        },
        toShowUserPop(toggle?: boolean) {
            this.showUserPop = toggle ?? !this.showUserPop
        },
        async toGetRechargeConfig() {
            this.rechargeConfig = await getRechargeConfig()
        }
    }
})
