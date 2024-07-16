// 获取写作详情
export function getWriteDetail(params: any) {
    return $request.get({ url: '/write/detail', params })
}

//获取写作类目
export function getWriteCategory() {
    return $request.get({ url: '/write/category' })
}

//获取提示内容
export function getTipsContent(params: any) {
    return $request.get({ url: '/index/prompt', params })
}

//生成大纲
export function generate(params: any) {
    return $request.post({ url: '/write/generate', params })
}

//生成全文
export function generateOrder(params: any) {
    return $request.post({ url: '/order/place', params })
}

//写作问题
export function getProblems(params?: any) {
    return $request.get({ url: '/write/problems', params })
}

//走马灯
export function getNotice(params?: any) {
    return $request.get({ url: '/order/notice', params })
}
