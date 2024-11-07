import EditFragmentForm from '@/client/component/EditFragmentForm'
import type { Fragment } from '@/client/model/fragment'
import { ActionIcon, Box, Card, Group, Stack, Text } from '@mantine/core'
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
        <ActionIcon size='sm' variant='subtle' onClick={props.onClickEdit}>
          <IconPencil />
        </ActionIcon>
      </Group>
    </Card>
  )
}

// TODO: Viewer に Edit が混ざっていてキモい
export function FragmentViewer({
  fragment,
  updateFragment,
}: FragmentViewerProps) {
  const [showEditor, setShowEditor] = useState(false)
  const { hovered, ref } = useHover()

  const showToolBox = hovered && !showEditor

  return (
    <Stack pos='relative' ref={ref}>
      {showToolBox && (
        // ToolBox の高さが 30px なので, その半分だけ上にずらす
        <Box pos='absolute' top='-15px' right='8px' style={{ zIndex: 5 }}>
          <ToolBox onClickEdit={() => setShowEditor(true)} />
        </Box>
      )}
      <Card withBorder className='whitespace-pre-wrap'>
        {showEditor ? (
          <EditFragmentForm
            closeEditor={() => setShowEditor(false)}
            currentContent={fragment.content}
            updateFragment={updateFragment}
          />
        ) : (
          <Text>{fragment.content}</Text>
        )}
      </Card>
    </Stack>
  )
}
