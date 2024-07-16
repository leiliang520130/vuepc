import { Alipay } from './alipay'
import { Pay } from './pay'
import { Wechat } from './wechat'
import { Balance } from './balance'
// 支付方式
enum PayWayEnum {
    BALANCE = 1,
    WECHAT = 2,
    ALIPAY = 3
}

const wechat = new Wechat()
// 注入微信支付
Pay.inject(PayWayEnum[2], wechat)
const alipay = new Alipay()
Pay.inject(PayWayEnum[3], alipay)
const balance = new Balance()
Pay.inject(PayWayEnum[1], balance)
const pay = new Pay()

export { pay, PayWayEnum }
