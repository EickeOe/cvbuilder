import { uploadImgApi } from '@/apis/workOrder'
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { useCallback, useEffect, useState } from 'react'
import styles from './index.module.less'

interface Props {
  value: string
  onChange(value: string): void
}

export default function RichTextEditor({ value, onChange }: Props) {
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(value))

  useEffect(() => {
    if (value !== editorState.toHTML()) {
      setEditorState(BraftEditor.createEditorState(value))
    }
  }, [value])

  const change = useCallback(
    (editorState) => {
      setEditorState(editorState)
      onChange(editorState.toHTML())
    },
    [onChange]
  )

  return (
    <div className={styles.richTextEditor}>
      <BraftEditor
        excludeControls={['font-size', 'font-family', 'line-height', 'letter-spacing', 'fullscreen', 'undo', 'redo']}
        value={editorState}
        onChange={change}
        media={{
          accepts: {
            video: false,
            audio: false
          },
          uploadFn(params) {
            console.log(params)
            const fd = new FormData()
            fd.append('file', params.file)
            console.log(params)
            uploadImgApi(fd)
              .then((res: any) => {
                console.log(res)
                params.success({
                  url: res,
                  meta: {
                    loop: false,
                    autoPlay: false,
                    controls: false
                  } as any
                })
              })
              .catch((err) => {
                console.log(err)
                params.error({
                  msg: ''
                })
              })
          }
        }}
      />
    </div>
  )
}
