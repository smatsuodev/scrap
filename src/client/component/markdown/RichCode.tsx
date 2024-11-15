import { Code } from '@mantine/core'
import { bundledLanguages, bundledThemes, createHighlighter } from 'shiki'

type CodeBlockProps = {
  code: string
  lang: string
}

const supportedLanguageNames = Object.keys(bundledLanguages)

const highlighter = await createHighlighter({
  themes: Object.keys(bundledThemes),
  langs: supportedLanguageNames,
})

export function RichCode({ code, lang }: CodeBlockProps) {
  const html = highlighter.codeToHtml(code, {
    lang: isLangSupported(lang) ? lang : 'plaintext',
    theme: 'github-light',
    structure: 'inline',
  })

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
    <Code block dangerouslySetInnerHTML={{ __html: html }} />
  )
}

function isLangSupported(lang: string): lang is keyof typeof bundledLanguages {
  return supportedLanguageNames.includes(lang)
}
