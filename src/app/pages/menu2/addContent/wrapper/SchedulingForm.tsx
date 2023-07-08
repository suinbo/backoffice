import React, { useState, useCallback, useMemo } from "react"
import FormItem from "@/components/ui/forms/FormItem"
import { Button } from "@/components/ui/buttons"
import { Delete, LibraryAdd } from "@material-ui/icons"
import TsTable from "@/components/ui/table/TsTable"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { contentsSettingType } from "../const"
import { Selectbox } from "@/components/ui/forms"
import { CellProps } from "@/components/ui/table/tsTypes"
import { TableTheme } from "@/utils/resources/types"
import { ContentsProp, CurationDetailProp, CurationSectionData, ModalSelectBoxItem } from "../types"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { setListOrderChange } from "@/utils/common"
import { Checkbox } from "@/components/ui/forms"
import AddContentModal from "../../../modal/AddContentModal"

/**
 * 콘텐츠 편성 영역
 */
const ContentsSchedulingForm = ({
    order,
    formItem,
    selectBoxItems,
    sectionData,
    setSectionData,
    isReOrdering = false,
    setReOrdering,
}: {
    order?: number
    formItem: CurationDetailProp
    selectBoxItems?: ModalSelectBoxItem
    sectionData?: CurationSectionData[]
    isReOrdering?: boolean
    setSectionData: React.Dispatch<React.SetStateAction<CurationSectionData[]>>
    setReOrdering?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { t } = useTranslation(T_NAMESPACE.MENU2)
    const { t: m } = useTranslation(T_NAMESPACE.MENU2)
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)

    const { contentsType, sectionYn } = formItem
    const [openContentModal, setOpenContentModal] = useState<boolean>(false)

    /** 컨텐츠 추가 */
    const addContentItem = useCallback((value: Array<any>) => {
        setSectionData(prev => {
            const contents = value.map((item: any) => ({
                pgCd: item.pgCd,
                pgNm: item.pgNm,
                epiCd: item.epiCd,
                epiNm: item.epiNm,
                serviceCnt: item.serviceCnt,
                bandYn: false,
            }))

            prev[order].organizations = [...prev[order].organizations, ...contents].map((item, index) => ({ ...item, orderNo: index + 1 }))
            return [...prev]
        })
    }, [])

    /** 섹션 별 컨텐츠 밴드 노출 여부 설정 */
    const onSelectBandYn = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, sectionIdx: number, key?: string) => {
            const { id } = e.target
            setSectionData(prev => {
                prev[sectionIdx].organizations = prev[sectionIdx].organizations.map(item => {
                    if (item[key] == id) item.bandYn = !item.bandYn
                    return item
                })
                return [...prev]
            })
        },
        [sectionData]
    )

    /** 섹션 별 컨텐츠 순서 변경 */
    const onOrderRow = useCallback(
        (sectionIdx: number, prevOrder: number, selectedItem: SelectBoxItem) => {
                setSectionData((prev: CurationSectionData[]) => {
                    if (!isReOrdering) {
                        prev[sectionIdx].organizations = prev[sectionIdx].organizations
                            .map(item => {
                                const nextOrder = Number(selectedItem.value)
                                item.orderNo = item.orderNo == prevOrder ? nextOrder : item.orderNo == nextOrder ? prevOrder : item.orderNo
                                return item
                            })
                            .sort((prev, cur) => prev.orderNo - cur.orderNo)
                    } else {
                        prev[sectionIdx].organizations = prev[sectionIdx].organizations.map((item, index) => ({ ...item, orderNo: index + 1 }))
                    }
                    return [...prev]
                })
            isReOrdering && setReOrdering(false)
        },
        [isReOrdering]
    )

    /** 섹션 별 콘텐츠 삭제 */
    const onDeleteRow = useCallback(
        (sectionIdx: number, row: ContentsProp) => {
                setSectionData((prev: CurationSectionData[]) => {
                    prev[sectionIdx].organizations = prev[sectionIdx].organizations
                        .filter(contents => row.orderNo !== contents.orderNo)
                        .map((item, index) => ({ ...item, orderNo: index + 1 }))
                    return [...prev]
                })
        },
        [sectionData]
    )

    /** 섹션 별 콘텐츠 Drag 순서 변경 */
    const onDrop = useCallback(
        ({ sectionIdx, dragIdx, dropIdx }: { sectionIdx: number; dragIdx: number; dropIdx: number }) => {
                setSectionData((prev: CurationSectionData[]) => {
                    const sectionContents = prev[sectionIdx].organizations
                    const orderedList = setListOrderChange(sectionContents, dragIdx, dropIdx) as ContentsProp[]
                    prev[sectionIdx].organizations = orderedList
                    return [...prev]
                })
        },
        [sectionData]
    )

    /** 컨텐츠 1 타입 컬럼 */
    const tsColumnsContent1 = useCallback(
        (sectionIdx: number) => {
            return [
                { id: "pgCd", accessorKey: "pgCd", header: t("programCode") },
                { id: "pgNm", accessorKey: "pgNm", header: t("programName") },
                { id: "serviceCnt", accessorKey: "serviceCnt", header: t("serviceSequence")},
                sectionYn && {
                    id: "viewYn",
                    accessorKey: "viewYn",
                    header: t("viewYn"),
                    cell: ({ row }: CellProps) => {
                        const { pgCd } = row.original
                        const isChecked = sectionData[sectionIdx].organizations.find(item => item.pgCd == pgCd)?.bandYn
                        return (
                            <Checkbox id={pgCd as string} onChange={e => onSelectBandYn(e, sectionIdx, "pgCd")} isChecked={isChecked} />
                        )
                    },
                },
                {
                    id: "delete",
                    accessorKey: "delete",
                    header: g("button.delete"),
                    cell: ({ row }: CellProps) => (
                        <Button
                            styleType={ButtonStyleType.danger}
                            border={true}
                            onClick={() => onDeleteRow(sectionIdx, row.original as ContentsProp)}>
                            <Delete className="icon del" />
                            {g("button.delete")}
                        </Button>
                    ),
                },
            ].filter(Boolean)
        },
        [sectionData]
    )

    /** 컨텐츠 2 타입 컬럼 */
    const tsColumnsContent2 = useCallback(
        (sectionIdx: number) => {
            return [
                { id: "drag", accessorKey: "drag", header:  g("drag") },
                {
                    id: "orderNo",
                    accessorKey: "orderNo",
                    header: g("orderNo"),
                    cell: (props: CellProps) => {
                        const { table, row } = props
                        const contents = sectionData[sectionIdx].organizations
                        const selectedList = contents.map(item => ({ label: String(item.orderNo), value: String(item.orderNo) }))

                        return (
                            <Selectbox
                                ref={table.options.meta?.getTableRef()}
                                isTableIn={true}
                                items={selectedList}
                                onChange={item => onOrderRow(sectionIdx, row.original.orderNo as number, item)}
                                defaultItem={selectedList.find(item => item.value == row.original.orderNo)}
                            />
                        )
                    },
                },
                { id: "pgCd", accessorKey: "pgCd", header: t("programCode") },
                { id: "pgNm", accessorKey: "pgNm", header: t("programName") },
                { id: "epiCd", accessorKey: "epiCd", header: t("episodeCode") },
                { id: "epiNm", accessorKey: "epiNm", header: t("episodeName") },
                sectionYn && {
                    id: "bandYn",
                    accessorKey: "bandYn",
                    header: t("checkYn"),
                    cell: ({ row }: CellProps) => {
                        const { epiCd } = row.original
                        const isChecked = sectionData[sectionIdx].organizations.find(item => item.epiCd == epiCd)?.bandYn
                        return (
                            <Checkbox id={epiCd as string} onChange={e => onSelectBandYn(e, sectionIdx, "epiCd")} isChecked={isChecked} />
                        )
                    },
                },
                {
                    id: "delete",
                    accessorKey: "delete",
                    header: g("button.delete"),
                    cell: ({ row }: CellProps) => (
                        <Button
                            styleType={ButtonStyleType.danger}
                            border={true}
                            onClick={() => onDeleteRow(sectionIdx, row.original as ContentsProp)}>
                            <Delete className="icon del" />
                            {g("button.delete")}
                        </Button>
                    ),
                },
            ].filter(Boolean)
        },
        [sectionData]
    )

    /** 컨텐츠 1 타입 모달 컬럼 */
    const tsModalColumnsContent1 = useMemo(
        () => [
            { id: "check", accessorKey: "check" },
            { id: "pgCd", accessorKey: "pgCd", header: t("programCode") },
            { id: "pgNm", accessorKey: "pgNm", header: t("programName") },
            { id: "serviceCnt", accessorKey: "serviceCnt", header: t("serviceSequence") },
            { id: "gradeNm", accessorKey: "gradeNm", header: t("gradeName") },
            { id: "ctType", accessorKey: "ctType", header: t("contentsType") },
            { id: "nation", accessorKey: "nation", header: t("makeNation") },
        ],
        []
    )

    /** 컨텐츠 2 타입 모달 컬럼 */
    const tsModalColumnsContent2 = useMemo(
        () => [
            { id: "check", accessorKey: "check" },
            { id: "pgCd", accessorKey: "pgCd", header: t("programCode") },
            { id: "pgNm", accessorKey: "pgNm", header: t("programName") },
            { id: "serviceCnt", accessorKey: "serviceCnt", header: t("serviceSequence") },
            { id: "epiCd", accessorKey: "epiCd", header: t("episodeCode") },
            { id: "epiNm", accessorKey: "epiNm", header: t("episodeName") },
            { id: "gradeNm", accessorKey: "gradeNm", header: m("gradeName") },
            { id: "nation", accessorKey: "nation", header: m("makeNation") },
        ],
        []
    )

    /** 컨텐츠 2 타입 모달 컬럼 */
    const tsModalColumnsContent3 = useMemo(
        () => [
            { id: "check", accessorKey: "check" },
            { id: "pgCd", accessorKey: "pgCd", header: t("programCode") },
            { id: "pgNm", accessorKey: "pgNm", header: t("programName") },
            { id: "serviceCnt", accessorKey: "serviceCnt", header: t("serviceSequence") },
            { id: "epiCd", accessorKey: "epiCd", header: t("episodeCode") },
            { id: "epiNm", accessorKey: "epiNm", header: t("episodeName") },
            { id: "gradeNm", accessorKey: "gradeNm", header: m("gradeName") },
            { id: "nation", accessorKey: "nation", header: m("makeNation") },
        ],
        []
    )
    

    /** 컨텐츠 조회 타입 별 데이터
     * @desc
     */
    const tsColumn: { [key: string]: any } = useMemo(() => ({
        content1: {
            formItem: tsColumnsContent1(order),
            modal: tsModalColumnsContent1,
            selectboxItem: selectBoxItems.pSearchType,
        },
        content2: {
            formItem: tsColumnsContent2(order),
            modal: tsModalColumnsContent2,
            selectboxItem: selectBoxItems.eSearchType,
        },
        content3: {
            formItem: tsColumnsContent1(order),
            modal: tsModalColumnsContent3,
            selectboxItem: selectBoxItems.eSearchType,
        },
    }), [sectionData, selectBoxItems, formItem])

    return (
        <>
            <FormItem title={t("contentsList")} required={true}>
                <div className="formItem width-full content-add">
                    <Button
                        styleType={ButtonStyleType.primary}
                        border={true}
                        onClick={() => setOpenContentModal(true)}>
                        <LibraryAdd />
                        {t(contentsSettingType[formItem.contentsType]?.button)}
                    </Button>
                    <TsTable
                        keyName="pgCd" 
                        columns={tsColumn[formItem.contentsType].formItem}
                        rows={sectionData[order]?.organizations}
                        theme={TableTheme.lined}
                        noResultMsg={g("noResult")}
                        onDrop={({ dragIdx, dropIdx }: { dragIdx: number; dropIdx: number }) => onDrop({ sectionIdx: order, dragIdx, dropIdx })}
                    />
                </div>
            </FormItem>
            {openContentModal && (
                <AddContentModal
                    onClose={() => setOpenContentModal(false)}
                    setItem={addContentItem}
                    item={sectionData[order].organizations.map(item => item.episodeCode)}
                    customItems={{
                        columns: tsColumn[contentsType].modal,
                        selectBoxItems: tsColumn[contentsType].selectboxItem,
                    }}
                />
            )}
        </>
    )
}

export default ContentsSchedulingForm
