import React from "react"
import Layer from "@/components/layout"
import { DividerIcon } from "@/components/layout/types"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { Button } from "@/components/ui/buttons"
import { SearchFormProp } from "./types"
import { SaveAlt, Search } from "@material-ui/icons"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE } from "@/utils/resources/constants"
import "./styles.scss"

const SearchForm = ({ title = "", children = null, onSearch, onClear, downloadEvent, download }: SearchFormProp) => {
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    return (
        <div className="search-form">
            <Layer.DividerHeader icon={DividerIcon.search} title={title}>
                <div className="button-group">
                    {download && (
                        <Button onClick={() => downloadEvent()} styleType={ButtonStyleType.primary} border={true} classList={["download"]}>
                            <SaveAlt />
                            {g("button.downLoadExcel")}
                        </Button>
                    )}
                    {!!onClear && (
                        <Button styleType={ButtonStyleType.default} onClick={() => onClear()}>
                            {g("button.reset")}
                        </Button>
                    )}
                    <Button styleType={ButtonStyleType.default} onClick={onSearch}>
                        <Search className="search-icon" />
                        {g("button.search")}
                    </Button>
                </div>
            </Layer.DividerHeader>
            <div className="search-area">{children}</div>
        </div>
    )
}

export default SearchForm
