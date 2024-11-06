import { Button, Group, Stack, Title } from '@mantine/core'
import type { FragmentInput } from '@/client/model/fragment'
import { useForm } from '@mantine/form'
import { getHotkeyHandler } from '@mantine/hooks'
import FragmentEditor from '@/client/component/FragmentEditor'

interface FragmentFormProps {
  onSubmit: (input: FragmentInput) => void
}

export interface FragmentFormValues {
  content: string
}

const LOCAL_STORAGE_KEY_NEW_FRAGMENT = 'draft-new-fragment'
function generateLocalStorageKeyForEditFragment(id: number) {
  return `draft-fragment-${id}`
}

export function FragmentForm({ onSubmit }: FragmentFormProps) {
  const form = useForm<FragmentFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      content: localStorage.getItem(LOCAL_STORAGE_KEY_NEW_FRAGMENT) ?? '',
    },
    validate: {
      content: (content) =>
        content.length > 0 ? null : '1文字以上入力してください',
    },
    onValuesChange: ({ content }) => {
      localStorage.setItem(LOCAL_STORAGE_KEY_NEW_FRAGMENT, content)
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    onSubmit(values)
    localStorage.removeItem(LOCAL_STORAGE_KEY_NEW_FRAGMENT)
    form.setInitialValues({ content: '' })
    form.reset()
  })
  const onKeyDown = getHotkeyHandler([['mod+Enter', handleSubmit]])

  return (
    <Stack>
      <Title order={2} mb='xs'>
        新しいフラグメント
      </Title>
      <form onSubmit={handleSubmit}>
        <FragmentEditor form={form} onKeyDown={onKeyDown} />
        <Group justify='flex-end' mt='md'>
          <Button type='submit'>投稿</Button>
        </Group>
      </form>
    </Stack>
  )
}
