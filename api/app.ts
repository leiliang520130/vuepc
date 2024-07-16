//发送短信
export function smsSend(params: any) {
    return $request.post({ url: '/sms/sendCode', params })
}

//发送邮件
export function emailSend(params: any) {
    return $request.post({ url: '/email/sendCode', params })
}

// 获取配置
export function getConfig() {
    return $request.get({ url: '/index/config' })
}

// 获取协议
export function getPolicy(params: any) {
    return $request.get({ url: '/index/policy', params })
}

// 上传图片
export function uploadImage(params: any) {
    return $request.uploadFile({ url: '/upload/image' }, params)
}
