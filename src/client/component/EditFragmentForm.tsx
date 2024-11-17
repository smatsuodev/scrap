import FragmentEditor from '@/client/component/FragmentEditor'
import type { FragmentFormValues } from '@/client/component/FragmentForm'
import useEditFragmentDraft from '@/client/hook/useEditFragmentDraft'
import type { Fragment } from '@/client/model/fragment'
import { Button, Group, Modal, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler, useDisclosure } from '@mantine/hooks'
import { IconAlertTriangleFilled } from '@tabler/icons-react'

function CancelModalTitle() {
  return (
    <>
      <Group gap='xs'>
        <IconAlertTriangleFilled color='var(--mantine-color-yellow-7)' />
        <Text>警告</Text>
      </Group>
    </>
  )
}

type EditCancelModalProps = {
  modalOpened: boolean
  closeModal: () => void
  onConfirm: () => void
}

function CancelModal(props: EditCancelModalProps) {
  return (
    <Modal
      opened={props.modalOpened}
      onClose={props.closeModal}
      title={<CancelModalTitle />}
    >
      <Text>保存していない変更が削除されます</Text>
      <Group justify='flex-end' mt='sm'>
        <Button variant='filled' color='red' onClick={props.onConfirm}>
          削除
        </Button>
      </Group>
    </Modal>
  )
}

export type EditFragmentFormProps = {
  closeEditor: () => void
  updateFragment: (content: string) => Promise<void>
  fragment: Fragment
}

export default function EditFragmentForm(props: EditFragmentFormProps) {
  const [modalOpened, { toggle: toggleModal, close: closeModal }] =
    useDisclosure(false)
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

  const handleCancel = () => {
    const draftExists = getDraft() !== null
    if (draftExists) {
      toggleModal()
    } else {
      props.closeEditor()
    }
  }

  const handleConfirmDiscard = () => {
    removeDraft()
    props.closeEditor()
    toggleModal()
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

      <CancelModal
        modalOpened={modalOpened}
        closeModal={closeModal}
        onConfirm={handleConfirmDiscard}
      />
    </>
  )
}
