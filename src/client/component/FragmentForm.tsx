import { Button, Container, Group, Stack, Textarea, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler } from '@mantine/hooks'
import type { FragmentInput } from '@/client/model/fragment'

interface FragmentFormProps {
  onSubmit: (input: FragmentInput) => void
}

export function FragmentForm({ onSubmit }: FragmentFormProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      content: '',
    },
    validate: {
      content: (content) =>
        content.length > 0 ? null : '1文字入力してください',
    },
  })
  const handleSubmit = form.onSubmit(async (values) => {
    onSubmit(values)
    console.log(values)
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
