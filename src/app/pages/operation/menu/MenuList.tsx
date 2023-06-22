import React, { useCallback, useMemo, useState } from "react"
import { Tree } from "@/components/ui/tree"
import { useTranslation } from "react-i18next"
import { T_NAMESPACE, T_PREFIX } from "@/utils/resources/constants"
import { Button, DeleteButton } from "@/components/ui/buttons"
import { ButtonStyleType, DeleteButtonType } from "@/components/ui/buttons/types"
import { MenuStateType } from "./types"
import { useRequest } from "@/contexts/SendApiContext"
import { applyPath } from "@/utils/apis/request"
import { API, HTTP_METHOD_DELETE } from "@/utils/apis/request.const"
import { NodeItems, NodeProp, TreeTheme } from "@/components/ui/tree/types"
import { CHECK_THREE_DEPTH, MENU_LIST_KEY } from "./const"

const List = ({ menuState, setMenuState }: { menuState: MenuStateType; setMenuState: (menuState: MenuStateType) => void }) => {
    const { t } = useTranslation(T_NAMESPACE.GLOBAL, { keyPrefix: T_PREFIX.MENU })
    const { t: g } = useTranslation(T_NAMESPACE.GLOBAL)
    const { useFetch, useAxios } = useRequest()

    /**화면 상태 변수 */
    const { menuId, depth, nodeId, viewYn } = menuState
    const [parentId, setParentId] = useState<string | null>(null)
    const [result, setResult] = useState<NodeItems>([])

    //메뉴 리스트
    const { refetch: setMenus } = useFetch<NodeItems>(
        { url: API.TOP_MENUS, key: MENU_LIST_KEY },
        {
            onSuccess: (res: NodeItems) => setResult(res),
        }
    )

    // 커스텀 노드 렌더러
    const renderer = useCallback(
        ({ node, Content }) => {
            const hasLeafs = useMemo(() => node.leafs && node.leafs.length > 0, [node])

            /** Toggle click node */
            const onNodeClick = (clickNode: NodeProp) => {
                console.log("clickNode:: ", clickNode)
                setMenuState({
                    menuId: clickNode.menuId,
                    nodeId: clickNode.id,
                    viewYn: clickNode.viewYn,
                    depth: clickNode.depth,
                    hasLeafs,
                })
            }

            return (
                <Content classList={{ selected: node.menuId == menuId }} nodeClick={onNodeClick}>
                    <span className="em-tree-data"> {node.menuNm} </span>
                    <DeleteButton
                        type={DeleteButtonType.DeleteRounded}
                        onClick={() =>
                            useAxios(
                                {
                                    url: applyPath(API.FAQ_DETAIL, node.menuId),
                                    method: HTTP_METHOD_DELETE,
                                },
                                () => {
                                    if (node.menuId == menuId) {
                                        setMenuState({ menuId: null, nodeId: null })
                                    }
                                    setMenus()
                                }
                            )
                        }
                        buttonProp={{ disabled: !!node.leafs?.length, classList: ["tree-icon"] }}
                    />
                </Content>
            )
        },
        [menuId, result]
    )

    const rootRenderer = useCallback(
        ({ Content }) => {
            /** Toggle click node */
            const onNodeClick = () => {
                setMenuState({ viewYn: false, depth: 0, menuId: "", nodeId: "" })
            }

            return (
                <Content classList={{ active: menuId === "" }} nodeClick={onNodeClick}>
                    {t("menuList")}
                </Content>
            )
        },
        [menuId]
    )

    return (
        <div id="menuList">
            {!!result && (
                <Tree
                    keyName="menuId"
                    nodes={result}
                    nodeRenderer={renderer}
                    leafRenderer={renderer}
                    rootRenderer={rootRenderer}
                    activateNodeId={menuId}
                    expandAll={false}
                    theme={[TreeTheme.boxed, TreeTheme.expandOut]}
                    parentId={parentId}>
                    {() => {
                        const onCreate = useCallback(() => {
                            if (viewYn) return
                            if (depth >= CHECK_THREE_DEPTH) return
                            if (menuId !== null) {
                                const param = {
                                    parentId: menuId,
                                }
                                useAxios(
                                    {
                                        url: API.FAQ_DETAIL,
                                        param: param,
                                    },
                                    res => {
                                        setMenus()
                                        const { id, uxList } = res
                                        setParentId(nodeId)
                                        setMenuState({
                                            menuId: id,
                                            nodeId: id,
                                            depth: depth + 1,
                                            hasLeafs: uxList.length > 0,
                                        })
                                    }
                                )
                            }
                        }, [menuId, nodeId])

                        return (
                            <div className="button-group">
                                <Button
                                    styleType={
                                        viewYn || depth >= CHECK_THREE_DEPTH || nodeId === null ? ButtonStyleType.default : ButtonStyleType.primary
                                    }
                                    onClick={onCreate}
                                    disabled={viewYn || depth >= CHECK_THREE_DEPTH || nodeId === null}
                                    border={true}>
                                    {g("button.create")}
                                </Button>
                            </div>
                        )
                    }}
                </Tree>
            )}
        </div>
    )
}

export default List
