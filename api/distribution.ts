//分销申请
export function apply(params: Record<string, any>) {
    return $request.post({ url: '/distribution/apply', params })
}

//佣金明细变动类型
export function MoneyChangeType(params?: any) {
    return $request.get({ url: '/account_log/getUeChangeType', params })
}

//账户流水记录列表
export function MoneyList(params?: any) {
    return $request.get({ url: '/account_log/lists', params })
}

// 粉丝列表
export function fansList(params?: any) {
    return $request.get({ url: '/distribution/fans', params })
}

// 分销中心
export function distributionCenter(params?: any) {
    return $request.get({ url: '/distribution/index', params })
}

//提现方式
export function withdrawWay(params?: any) {
    return $request.get({ url: '/withdraw/withdrawType', params })
}

//提现记录列表
export function withdrawList(params?: any) {
    return $request.get({ url: '/withdraw/lists', params })
}

//提现详情
export function withdrawDetail(params?: any) {
    return $request.get({ url: '/withdraw/detail', params })
}

//提现详情
export function applyWithdraw(params?: any) {
    return $request.post({ url: '/withdraw/apply', params })
}
