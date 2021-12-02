import { useEffect, useRef } from 'react'
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution'
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import { editor } from 'monaco-editor'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!window.MonacoEnvironment) {
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') return new TsWorker()
      if (label === 'json') return new JsonWorker()
      if (label === 'css') return new CssWorker()
      if (label === 'html') return new HtmlWorker()
      return new EditorWorker()
    }
  }
}

interface Props {
  value: string
  onChange(nV: string): void
  language: string
}

export default function CodeEditor({ value = '', onChange, language = '' }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<editor.IStandaloneCodeEditor>()
  useEffect(() => {
    codeRef.current = editor.create(divRef.current as HTMLDivElement, {
      value,
      language
    })
    codeRef.current.onDidBlurEditorText(() => {
      onChange(codeRef.current?.getValue() ?? '')
    })
    return () => {
      codeRef.current?.dispose()
    }
  }, [])
  useEffect(() => {
    if (value !== codeRef.current?.getValue()) {
      codeRef.current?.setValue(value)
    }
  }, [value])
  return <div style={{ height: 600 }} ref={divRef}></div>
}
