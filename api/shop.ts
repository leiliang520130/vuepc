//首页数据
export function getIndex() {
    return $request.get({ url: '/index/index' })
}
