// import { getClient } from '~~/utils/env'
import { getClient } from '@/utils/client'

// 登录
export function login(params: any) {
    return $request.post({
        url: '/login/account',
        params: { ...params, terminal: getClient() }
    })
}

//账号密码login
export function pwdLogin(params: any) {
    return $request.post({
        url: '/login/pwdLogin',
        params: { ...params, terminal: getClient() }
    })
}

// 登录
export function logout() {
    return $request.post({ url: '/login/logout' })
}

//注册
export function register(params: any) {
    return $request.post({
        url: '/login/register',
        params: { ...params, channel: getClient() }
    })
}

//向微信请求code的链接
export function getWxCodeUrl() {
    return $request.get({
        url: '/login/codeUrl',
        params: {
            url: location.href
        }
    })
}

export function wxLogin(params: any) {
    return $request.post({ url: '/login/scanLogin', params })
}

export function wxJsConfig(params: any) {
    return $request.get({ url: '/wechat/jsConfig', params })
}
