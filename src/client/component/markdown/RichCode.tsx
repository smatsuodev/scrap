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
          {({ copied, copy }) => {
            if (copied) {
              return (
                <Tooltip label='コピーされました' closeDelay={1500} withArrow>
                  <ActionIcon color='teal' variant='subtle' onClick={copy}>
                    <IconCheck style={{ width: rem(16) }} />
                  </ActionIcon>
                </Tooltip>
              )
            }
            return (
              <ActionIcon color='gray' variant='subtle' onClick={copy}>
                <IconCopy style={{ width: rem(16) }} />
              </ActionIcon>
            )
          }}
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
