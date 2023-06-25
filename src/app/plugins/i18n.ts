import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { localeKR } from "./locales"

const namespaces = ["global", "menu1"]

i18n.use(initReactI18next).init(
    {
        ns: namespaces,
        defaultNS: "global",
        resources: {
            ko: {
                global: localeKR.global,
                intro: localeKR.intro,
                menu1: localeKR.menu1,
            },
        },
        fallbackLng: ["en", "ko"],
        supportedLngs: ["en", "ko"],
        interpolation: { escapeValue: false },
        detection: { order: ["path", "navigator"] },
        debug: false,
    },
    (err, t) => {
        if (err) return console.log("error ocurred with i18next", err)
        t("global.language")
    }
)
