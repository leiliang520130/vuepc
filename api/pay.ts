// 获取支付方式列表
export function getPayWay(params?: any) {
    return $request.get({ url: '/pay/payWay', params })
}

//查询支付状态
export function getOrderStatus(params?: any) {
    return $request.get({ url: '/pay/payStatus', params })
}

//支付下单
export function prepay(params: any) {
    return $request.post({ url: '/pay/prepay', params })
}

//充值下单
export function rechargePrepay(params: any) {
    return $request.post({ url: '/recharge/recharge', params })
}

//结算信息
export function getOrderData(params: any) {
    return $request.post({ url: '/order/settle', params })
}

//获取增值服务
export function AddedServiceList(params?: any) {
    return $request.get({ url: '/write/addedService', params })
}

//获取充值模板列表
export function getRechargeTemplateList(params?: any) {
    return $request.get({ url: '/recharge/template', params })
}

//充值配置
export function getRechargeConfig(params?: any) {
    return $request.get({ url: '/recharge/config', params })
}

//充值走马灯
export function getRechargeNotice(params?: any) {
    return $request.get({ url: '/recharge/notice', params })
}
