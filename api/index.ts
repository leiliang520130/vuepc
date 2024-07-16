export function getsamplesLists(params: any) {
    return $request.get({
        url: '/question/samplesLists',
        params
    })
}
export function getdecorate(params: any) {
    return $request.get({
        url: '/index/decorate',
        params
    })
}

//访客增加
export function addVisit(params?: any) {
    return $request.post({
        url: '/index/visit',
        params
    })
}
