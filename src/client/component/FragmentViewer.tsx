import EditFragmentForm from '@/client/component/EditFragmentForm'
import { Markdown } from '@/client/component/markdown/Markdown'
import useEditFragmentDraft from '@/client/hook/useEditFragmentDraft'
import type { Fragment } from '@/common/model/fragment'
import { ActionIcon, Box, Card, Flex, Group, Stack, Text } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconPencil } from '@tabler/icons-react'
import { useState } from 'react'

interface FragmentViewerProps {
  fragment: Fragment
  updateFragment: (content: string) => Promise<void>
}

type ToolBoxProps = {
  onClickEdit: () => void
}

function ToolBox(props: ToolBoxProps) {
  return (
    <Card p='2px' withBorder>
      <Group gap='4px' justify='center'>
        <ActionIcon
          size='sm'
          variant='subtle'
          onClick={props.onClickEdit}
          color='var(--mantine-color-default-color)'
        >
          <IconPencil />
        </ActionIcon>
      </Group>
    </Card>
  )
}

type FragmentContentProps = {
  fragment: Fragment
}

function FragmentContent(props: FragmentContentProps) {
  return <Markdown markdown={props.fragment.content} />
}

// TODO: Viewer に Edit が混ざっていてキモい. 親で切り替えたほうがいい?
export function FragmentViewer({
  fragment,
  updateFragment,
}: FragmentViewerProps) {
  const { getDraft } = useEditFragmentDraft(fragment.id)
  // 空でない draft が存在したら、初めから editor を表示する
  const [showEditor, setShowEditor] = useState(() => !!getDraft())
  const { hovered, ref } = useHover()

  const showToolBox = hovered && !showEditor

  /**
   * NOTE: 内容の更新ボタンを押した後も hovered === true になるバグがある
   * onMouseEnter, onMouseLeave で制御しても解決しなかった
   */
  return (
    <Stack pos='relative' ref={ref}>
      {showToolBox && (
        // ToolBox の高さが 30px なので, その半分だけ上にずらす
        <Box pos='absolute' top='-15px' right='8px' style={{ zIndex: 5 }}>
          <ToolBox onClickEdit={() => setShowEditor(true)} />
        </Box>
      )}
      <Card withBorder>
        {showEditor ? (
          <EditFragmentForm
            closeEditor={() => setShowEditor(false)}
            updateFragment={updateFragment}
            fragment={fragment}
          />
        ) : (
          <>
            <FragmentContent fragment={fragment} />
            <Flex justify='flex-end'>
              <Text size='xs' c='dimmed'>
                {fragment.authorId}
              </Text>
            </Flex>
          </>
        )}
      </Card>
    </Stack>
  )
}
