import FragmentEditor from '@/client/component/FragmentEditor'
import type { FragmentFormValues } from '@/client/component/FragmentForm'
import { Button, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler } from '@mantine/hooks'
import type { FormEvent } from 'react'

export type EditFragmentFormProps = {
  currentContent: string
  closeEditor: () => void
  updateFragment: (content: string) => Promise<void>
}

export default function EditFragmentForm(props: EditFragmentFormProps) {
  // TODO: FragmentForm と重複してるので、どうにかしたい
  const form = useForm<FragmentFormValues>({
    initialValues: {
      content: props.currentContent,
    },
    validate: {
      content: (content) =>
        content.length > 0 ? null : '1文字以上入力してください',
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    await props.updateFragment(values.content)
    props.closeEditor()
  })
  const onKeyDown = getHotkeyHandler([['mod+Enter', handleSubmit]])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FragmentEditor form={form} onKeyDown={onKeyDown} />
        <Group justify='flex-end' mt='md'>
          <Button type='submit'>更新</Button>
        </Group>
      </form>
    </>
  )
}
