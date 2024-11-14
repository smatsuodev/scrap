import FragmentEditor from '@/client/component/FragmentEditor'
import type { FragmentFormValues } from '@/client/component/FragmentForm'
import useEditFragmentDraft from '@/client/hook/useEditFragmentDraft'
import type { Fragment } from '@/client/model/fragment'
import { Button, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler } from '@mantine/hooks'

export type EditFragmentFormProps = {
  closeEditor: () => void
  updateFragment: (content: string) => Promise<void>
  fragment: Fragment
}

export default function EditFragmentForm(props: EditFragmentFormProps) {
  const { getDraft, saveDraft, removeDraft } = useEditFragmentDraft(
    props.fragment.id,
  )

  // TODO: FragmentForm と重複してるので、どうにかしたい
  const form = useForm<FragmentFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      /**
       * 空の draft は復元する意味がないので、元の content を表示
       * ただし、実際は親コンポーネントの都合で editor は表示されない
       */
      content: getDraft() || props.fragment.content,
    },
    validate: {
      content: (content) =>
        content.length > 0 ? null : '1文字以上入力してください',
    },
    onValuesChange: ({ content }) => {
      saveDraft(content)
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    // fragment の更新後に editor を閉じるので、form の reset はしない
    await props.updateFragment(values.content)
    removeDraft()
    props.closeEditor()
  })
  const onKeyDown = getHotkeyHandler([['mod+Enter', handleSubmit]])

  // TODO: ダイアログを出す
  const handleCancel = () => {
    removeDraft()
    props.closeEditor()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FragmentEditor form={form} onKeyDown={onKeyDown} />
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={handleCancel}>
            キャンセル
          </Button>
          <Button type='submit'>更新</Button>
        </Group>
      </form>
    </>
  )
}
