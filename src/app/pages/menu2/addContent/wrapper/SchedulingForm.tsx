import React, { useState, useCallback, useMemo } from "react"
import FormItem from "@/components/ui/forms/FormItem"
import { Button } from "@/components/ui/buttons"
import { Delete, LibraryAdd } from "@material-ui/icons"
import TsTable from "@/components/ui/table/TsTable"
import { T_NAMESPACE } from "@/utils/resources/constants"
import { useTranslation } from "react-i18next"
import { ButtonStyleType } from "@/components/ui/buttons/types"
import { contentsSettingType, CHANNEL, EPG } from "../const"
import { Selectbox } from "@/components/ui/forms"
import { CellProps } from "@/components/ui/table/tsTypes"
import { TableTheme } from "@/utils/resources/types"
import { ContentsProp, CurationDetailProp, CurationSectionData, CurationSectionFormItem, ModalSelectBoxItem } from "../types"
import { SelectBoxItem } from "@/components/ui/forms/types"
import { setListOrderChange } from "@/utils/common"
//import ChannelAddModal from "@/pages/modal/common/AddChannelModal"
//import AddContentModal from "@/pages/modal/common/AddContentModal"
import { Checkbox } from "@/components/ui/forms"

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

    const { curationType, sectionYn } = formItem
    const [openContentModal, setOpenContentModal] = useState<boolean>(false)
    const [openChannelModal, setOpenChannelModal] = useState<boolean>(false)

    /** 에피소드 정렬 순서 선택 */
    const onSelectEpisodeOrder = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSectionData(prev => {
            prev[order].episodeOrder = e.target.value
            return [...prev]
        })
    }, [])

    /** 컨텐츠 추가 */
    const addContentItem = useCallback(
        (value: Array<any>) => {
            setSectionData(prev => {
                const contents = value.map(item => ({
                    contentType: item.ctsTypeNm,
                    programCode: item.ctsCd,
                    programName: item.ctsNm,
                    servEpiCnt: item.servEpiCnt,
                    epiCnt: item.epiCnt,
                    orderNo: 1,
                    bandYn: false,
                }))

                return prev.map((item, index) => {
                    if (index == order) return { ...item, organizations: contents }
                    return item
                })
            })
        },
        [curationType, formItem]
    )

    /** 에피소드 추가 */
    const addEpisodeItem = useCallback((value: Array<any>) => {
        setSectionData(prev => {
            const contents = value.map((item: any) => ({
                programCode: item.pgmCd,
                programName: item.pgmNm,
                episodeCode: item.epiCd,
                episodeName: item.epiNm,
                servEpiCnt: item.epiCycleNo,
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

    /** 에피소드(전체) 컬럼 */
    const tsColumnsAllEpisode = useCallback(
        (sectionIdx: number) => {
            return [
                { id: "programCode", accessorKey: "programCode", header: t("programCode") },
                { id: "programName", accessorKey: "programName", header: t("programName") },
                {
                    id: "servEpiCnt",
                    accessorKey: "servEpiCnt",
                    header: t("serviceSequence"),
                    accessorFn: (row: ContentsProp) => `${row.servEpiCnt}/${row.epiCnt}`,
                },
                sectionYn && {
                    id: "viewYn",
                    accessorKey: "viewYn",
                    header: t("viewYn"),
                    cell: ({ row }: CellProps) => {
                        const { programCode } = row.original
                        const isChecked = sectionData[sectionIdx].organizations.find(item => item.programCode == programCode)?.bandYn
                        return (
                            <Checkbox id={programCode as string} onChange={e => onSelectBandYn(e, sectionIdx, "programCode")} isChecked={isChecked} />
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

    /** 에피소드(단일) 컬럼 */
    const tsColumnsSingleEpisode = useCallback(
        (sectionIdx: number) => {
            return [
                { id: "drag", accessorKey: "drag", header: g("column.drag") },
                {
                    id: "orderNo",
                    accessorKey: "orderNo",
                    header: t("order"),
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
                { id: "programCode", accessorKey: "programCode", header: t("programCode") },
                { id: "programName", accessorKey: "programName", header: t("programName") },
                { id: "episodeCode", accessorKey: "episodeCode", header: t("episodeCode") },
                { id: "episodeName", accessorKey: "episodeName", header: t("episodeName") },
                { id: "servEpiCnt", accessorKey: "servEpiCnt", header: t("sequence") },
                sectionYn && {
                    id: "bandYn",
                    accessorKey: "bandYn",
                    header: t("bandYn"),
                    cell: ({ row }: CellProps) => {
                        const { episodeCode } = row.original
                        const isChecked = sectionData[sectionIdx].organizations.find(item => item.episodeCode == episodeCode)?.bandYn
                        return (
                            <Checkbox id={episodeCode as string} onChange={e => onSelectBandYn(e, sectionIdx, "episodeCode")} isChecked={isChecked} />
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

    /** 에피소드(전체) 모달 컬럼 */
    const tsAllEpisodeColumns = useMemo(
        () => [
            { id: "radio", accessorKey: "radio", header: g("column.select") },
            { id: "seasonCtsNo", accessorKey: "seasonCtsNo", header: t("seasonNo") },
            { id: "ctsCd", accessorKey: "ctsCd", header: t("programCode") },
            { id: "ctsNm", accessorKey: "ctsNm", header: t("programName") },
            { id: "ctsAttrNm", accessorKey: "ctsAttrNm", header: m("contentVersion") },
            { id: "epiCnt", accessorKey: "epiCnt", header: t("episodeCount") },
            { id: "gradeNm", accessorKey: "gradeNm", header: m("gradeName") },
            { id: "ctsGroupCd", accessorKey: "ctsGroupCd", header: m("contentGroupCode") },
            { id: "ctsTypeNm", accessorKey: "ctsTypeNm", header: m("contentType") },
            { id: "makeNatCd", accessorKey: "makeNatCd", header: m("makeNation") },
            { id: "chNm", accessorKey: "chNm", header: m("channel") },
            { id: "licns", accessorKey: "licns", header: m("licns") },
        ],
        []
    )

    /** 에피소드(단일) 모달 컬럼 */
    const tsSingleEpisodeColumns = useMemo(
        () => [
            { id: "check", accessorKey: "check" },
            { id: "seasonNo", accessorKey: "seasonNo", header: t("seasonNo") },
            { id: "pgmCd", accessorKey: "pgmCd", header: t("programCode") },
            { id: "pgmNm", accessorKey: "pgmNm", header: t("programName") },
            { id: "epiCycleNo", accessorKey: "epiCycleNo", header: t("sequence") },
            { id: "epiCd", accessorKey: "epiCd", header: t("episodeCode") },
            { id: "epiNm", accessorKey: "epiNm", header: t("episodeName") },
            { id: "gradeNm", accessorKey: "gradeNm", header: m("gradeName") },
            { id: "makeNatCd", accessorKey: "makeNatCd", header: m("makeNation") },
            { id: "chNm", accessorKey: "chNm", header: m("channel") },
            { id: "licns", accessorKey: "licns", header: m("licns") },
        ],
        []
    )

    /** 컨텐츠 조회 타입 별 데이터
     * @desc
     */
    const tsColumn: { [key: string]: CurationSectionFormItem } = useMemo(() => {
        return {
            content1: {
                formItem: tsColumnsAllEpisode(order),
                modal: tsAllEpisodeColumns,
                ctsTypeCd: ["PROGRAM"],
                selectboxItem: {
                    search: selectBoxItems.allEpisodeSearch,
                    content: selectBoxItems.content,
                },
            },
            content2: {
                formItem: tsColumnsSingleEpisode(order),
                modal: tsSingleEpisodeColumns,
                selectboxItem: {
                    search: selectBoxItems.singleEpisodeSearch,
                },
            },
            content3: {
                formItem: tsColumnsSingleEpisode(order),
                modal: tsSingleEpisodeColumns,
                selectboxItem: {
                    search: selectBoxItems.singleEpisodeSearch,
                },
            },
        }
    }, [sectionData, selectBoxItems, formItem])

    return (
        <>
            <FormItem title={t("contentsList")} required={true}>
                <div className="formItem width-full content-add">
                    <Button
                        styleType={ButtonStyleType.primary}
                        border={true}
                        onClick={() => {
                            const isLiveType = [CHANNEL, EPG].includes("EPISODE_ALL")
                            isLiveType ? setOpenChannelModal(true) : setOpenContentModal(true)
                        }}>
                        <LibraryAdd />
                        {t(contentsSettingType[formItem.contentsType]?.button)}
                    </Button>
                    <TsTable
                        keyName="episodeCode"
                        columns={tsColumn[formItem.contentsType].formItem}
                        rows={sectionData[order]?.organizations}
                        theme={TableTheme.lined}
                        noResultMsg={g("noResult")}
                        onDrop={({ dragIdx, dropIdx }: { dragIdx: number; dropIdx: number }) => onDrop({ sectionIdx: order, dragIdx, dropIdx })}
                    />
                </div>
            </FormItem>
            {/* {openContentModal && curationType !== EPISODE_SINGLE && (
                <AddContentModal
                    onClose={() => setOpenContentModal(false)}
                    setItem={addContentItem}
                    //에피소드(전체) 의 경우 key값 programCode
                    checkedItems={sectionData[order].organizations.map(item => (curationType == EPISODE_ALL ? item.programCode : item.contentCode))}
                    customItems={{
                        columns: tsColumn[curationType].modal,
                        selectBoxItems: tsColumn[curationType].selectboxItem,
                    }}
                    isRadio={curationType == EPISODE_ALL || formItem.curationClass == CONTENT}
                    contentsTypeCode={tsColumn[curationType]?.ctsTypeCd}
                />
            )} */}
            {/* {openContentModal && curationType == EPISODE_SINGLE && (
                <AddEpisodeModal
                    onClose={() => setOpenContentModal(false)}
                    setItem={addEpisodeItem}
                    item={sectionData[order].organizations.map(item => item.episodeCode)}
                    customItems={{
                        columns: tsColumn[curationType].modal,
                        selectBoxItems: tsColumn[curationType].selectboxItem,
                    }}
                />
            )} */}
            {/* {openChannelModal && (
                <ChannelAddModal
                    onClose={() => setOpenChannelModal(false)}
                    checkedItems={sectionData[order].organizations.map(item => item.channelCode)}
                    onSave={addChannelItem}
                    isRadio={curationType == EPG}
                    customItems={{
                        customColumns: tsColumn[curationType].modal,
                        selectBoxItems: tsColumn[curationType].selectboxItem,
                    }}
                />
            )} */}
        </>
    )
}

export default ContentsSchedulingForm
