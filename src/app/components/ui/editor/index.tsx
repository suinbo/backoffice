import React, { forwardRef } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import "./styles.scss"
import { Storage } from "@/utils/storage"
import customEditor from "@lib/editor/ckeditor"
import eng from "@lib/editor/translations/en"

interface EditorProp {
    type: string
    content: string
}

const Editor = forwardRef((props: EditorProp, ref) => {
    const language = () => {
        switch (Storage.get(Storage.keys.languageCode)) {
            case "en":
                return eng
            case "ko":
                return "ko"
            default:
                return eng
        }
    }

    // Editor configuration.
    const editorConfiguration = {
        toolbar: {
            items: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "outdent",
                "indent",
                "|",
                "blockQuote",
                "insertTable",
                "undo",
                "redo",
                "|",
                "fontSize",
                "fontColor",
                "fontBackgroundColor",
                "|",
                // 'imageUpload',
                "sourceEditing",
            ],
        },
        language: language(),
        table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableCellProperties", "tableProperties"],
        },
        link: {
            defaultProtocol: "https://",
        },
        // htmlSupport: {
        //     allow: [
        //         {
        //             name: /^((?!google-sheets-html-origin).)*$/,
        //             attributes: true,
        //             classes: true,
        //             styles: true,
        //         },
        //     ],
        // },
        indentBlock: {
            offset: 1,
            unit: "em",
        },
        fontColor: {
            // colors: [
            //     {
            //         color: 'hsl(',
            //     },
            // ],
        },
        fontSize: {
            options: ["default", "8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"],
        },
    }

    return (
        <div className="em-editor">
            <CKEditor editor={customEditor} data={props.content} ref={ref} config={editorConfiguration} />
        </div>
    )
})

export default React.memo(Editor)
