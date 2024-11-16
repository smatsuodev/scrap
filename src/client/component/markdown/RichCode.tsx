import { Code } from '@mantine/core'
import { useEffect, useState } from 'react'
import { bundledLanguages, codeToHtml } from 'shiki'

type CodeBlockProps = {
  code: string
  lang: string
}

const supportedLanguageNames = Object.keys(bundledLanguages)

export function RichCode({ code, lang }: CodeBlockProps) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    codeToHtml(code, {
      lang: isLangSupported(lang) ? lang : 'plaintext',
      theme: 'github-light',
      structure: 'inline',
    }).then(setHtml, console.error)
  }, [code, lang])

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
    <Code block dangerouslySetInnerHTML={{ __html: html }} />
  )
}

function isLangSupported(lang: string): lang is keyof typeof bundledLanguages {
  return supportedLanguageNames.includes(lang)
}
