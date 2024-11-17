import type { FragmentFormValues } from '@/client/component/FragmentForm'
import { Textarea } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import type { getHotkeyHandler } from '@mantine/hooks'

export type FragmentEditorProps = {
  form: UseFormReturnType<FragmentFormValues>
  onKeyDown: ReturnType<typeof getHotkeyHandler>
}

export default function FragmentEditor(props: FragmentEditorProps) {
  return (
    <Textarea
      label='投稿内容'
      placeholder='投稿する文章を入力...'
      key={props.form.key('content')}
      {...props.form.getInputProps('content')}
      onKeyDown={props.onKeyDown}
      autosize
      minRows={4}
    />
  )
}
