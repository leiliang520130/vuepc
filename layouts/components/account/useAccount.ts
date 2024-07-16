export enum PopupTypeEnum {
    LOGIN,
    FORGOT_PWD,
    EMAIL_FOEGOT_PWD,
    REGISTER,
    BIND_MOBILE,
    BIND_EMAIL,
    SET_PSW
}

export const useAccount = () => {
    const popupType = useState<PopupTypeEnum>(() => PopupTypeEnum.LOGIN)
    const setPopupType = (type: PopupTypeEnum = PopupTypeEnum.LOGIN) => {
        popupType.value = type
    }
    const showPopup = useState(() => false)
    const toggleShowPopup = (toggle: boolean) => {
        showPopup.value = toggle ?? !showPopup.value
    }
    return {
        popupType,
        setPopupType,
        showPopup,
        toggleShowPopup
    }
}
