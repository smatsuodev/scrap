import {
  ActionIcon,
  Box,
  Code,
  CopyButton,
  Stack,
  Tooltip,
  rem,
} from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
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
    <Stack pos='relative'>
      <Box
        pos='absolute'
        top='0'
        right='0'
        mt='5px'
        mr='6px'
        style={{ zIndex: 5 }}
      >
        <CopyButton value={code} timeout={1500}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'コピーされました' : 'コピー'} withArrow>
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                variant='subtle'
                onClick={copy}
              >
                {copied ? (
                  <IconCheck style={{ width: rem(16) }} />
                ) : (
                  <IconCopy style={{ width: rem(16) }} />
                )}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Box>

      <Code
        block
        // codeが空文字列の場合でも、一行分は表示されるようにする
        // min-height = line-height * font-size + 上下のpaddingの合計
        mih='calc(var(--mantine-line-height) * var(--mantine-font-size-xs) + var(--mantine-spacing-xs) * 2)'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Stack>
  )
}

function OverlayCopyButton({ value }: { value: string }) {}

function isLangSupported(lang: string): lang is keyof typeof bundledLanguages {
  return supportedLanguageNames.includes(lang)
}
