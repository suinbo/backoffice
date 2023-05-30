type storgaeProp = {
    keys: { [key: string]: string }
    set: (key: typeof Storage.keys[keyof typeof Storage.keys], value: string) => void
    get: (key: typeof Storage.keys[keyof typeof Storage.keys]) => string
    clear: () => void
}
export const Storage: storgaeProp = {
    keys: {
        expireTime: "expireTime",
        languageCode: "languageCode",
        timeZoneData: "timeZoneData",
        closePopup: "closePopup",
        regionCode: "regionCode",
        regionLangCode: "regionLangCode",
        loginIp: "loginIp",
        loginTime: "loginTime",
        loginId: "loginId",
    } as const,
    set: (key, value) => localStorage.setItem(key, value),
    get: key => localStorage.getItem(key),
    clear: () => localStorage.clear(),
}
