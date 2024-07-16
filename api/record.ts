// 获取订单列表
export function getOrderList(params: any) {
    return $request.get({ url: '/order/lists', params })
}

// 充值记录列表
export function getRechargeRecordList(params: any) {
    return $request.get({ url: '/recharge/lists', params })
}

export function downloadDom(params: any) {
    return $request.post({ url: '/order/auth', params })
}

//重新生成
export function toRetry(params: any) {
    return $request.post({ url: '/order/reset', params })
}
