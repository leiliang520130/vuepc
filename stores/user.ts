import { getUserCenter, shareInvite, updateUser } from '@/api/user'
import { TOKEN_KEY } from '@/enums/cacheEnums'
import { defineStore } from 'pinia'

interface UserSate {
    userInfo: Record<string, any>
    token: string | null
    temToken: string | null
}
export const useUserStore = defineStore({
    id: 'userStore',
    state: (): UserSate => {
        const TOKEN = useCookie(TOKEN_KEY)
        return {
            userInfo: {},
            token: TOKEN.value || null,
            temToken: null
        }
    },
    getters: {
        isLogin: (state) => !!state.token
    },
    actions: {
        async getUser() {
            const data = await getUserCenter()
            this.userInfo = data
            this.checkShare()
        },
        setUser(userInfo) {
            this.userInfo = userInfo
        },
        login(token: string) {
            const oneWeek = 7 * 24 * 60 * 60 * 1000
            const TOKEN = useCookie(TOKEN_KEY, {
                expires: new Date(Date.now() + oneWeek)
            })
            this.token = token
            TOKEN.value = token
        },

        logout() {
            const router = useRouter()
            const TOKEN = useCookie(TOKEN_KEY)
            router.push('/')
            this.token = null
            this.userInfo = {}
            TOKEN.value = null
        },
        //分享/邀请
        async checkShare() {
            //邀请id
            const user_sn = useCookie('user_sn')
            if (user_sn.value) {
                if (this.isLogin && this.userInfo.is_new_user == 1) {
                    await shareInvite({
                        user_sn: user_sn.value
                    })
                    // await updateUser()
                    user_sn.value = null
                }
            }
        }
    }
})
