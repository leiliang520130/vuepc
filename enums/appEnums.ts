//菜单主题类型
export enum ThemeEnum {
    LIGHT = 'light',
    DARK = 'dark'
}

// 菜单类型
export enum MenuEnum {
    CATALOGUE = 'M',
    MENU = 'C',
    BUTTON = 'A'
}

// 屏幕
export enum ScreenEnum {
    SM = 640,
    MD = 768,
    LG = 1024,
    XL = 1280,
    '2XL' = 1536
}

export enum SMSEnum {
    LOGIN = 'YZMDL',
    BIND_MOBILE = 'BDSJHM',
    CHANGE_MOBILE = 'BGSJHM',
    FIND_PASSWORD = 'ZHDLMM',
    BIND_EMAIL = 'BDYXHM ',
    CHANGR_EMAIL = 'BGYXHM ',
    SZMMYZM = 'SZMMYZM '
}

export enum PolicyAgreementEnum {
    SERVICE = 'service',
    PRIVACY = 'privacy'
}

//支付方式
export enum PayWayEnum {
    wxPay = 2,
    aliPay = 3
}

// 客户端
export enum ClientEnum {
    WEIXIN_OA = 2, // 微信-公众号
    H5 = 3, // H5
    PC = 4 //PC
}
