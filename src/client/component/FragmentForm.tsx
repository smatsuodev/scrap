import type { FragmentInput } from '@/client/model/fragment'
import { Button, Container, Group, Stack, Textarea, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler } from '@mantine/hooks'
import { useCallback } from 'react'

interface FragmentFormProps {
  onSubmit: (input: FragmentInput) => void
}

const LOCAL_STORAGE_KEY = 'draft-fragment'

export function FragmentForm({ onSubmit }: FragmentFormProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      content: localStorage.getItem(LOCAL_STORAGE_KEY) ?? '',
    },
    validate: {
      content: (content) =>
        content.length > 0 ? null : '1文字入力してください',
    },
    onValuesChange: ({ content }) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, content)
    },
  })
  const handleSubmit = form.onSubmit(async (values) => {
    onSubmit(values)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    form.reset()
  })

  return (
    <Stack>
      <Title order={2} mb='xs'>
        新しいフラグメント
      </Title>
      <form onSubmit={handleSubmit}>
        <Textarea
          label='投稿内容'
          placeholder='投稿する文章を入力...'
          key={form.key('content')}
          {...form.getInputProps('content')}
          onKeyDown={getHotkeyHandler([['mod+Enter', handleSubmit]])}
          autosize
          minRows={4}
        />
        <Group justify='flex-end' mt='md'>
          <Button type='submit'>投稿</Button>
        </Group>
      </form>
    </Stack>
  )
}
