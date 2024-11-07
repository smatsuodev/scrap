import EditFragmentForm from '@/client/component/EditFragmentForm'
import type { Fragment } from '@/client/model/fragment'
import Markdown from 'react-markdown'
import classes from './FragmentViewer.module.css'
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

// TODO: Viewer に Edit が混ざっていてキモい. 親で切り替えたほうがいい?
export function FragmentViewer({
  fragment,
  updateFragment,
}: FragmentViewerProps) {
  const [showEditor, setShowEditor] = useState(false)
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
      <Card withBorder className={classes.markdown}>
        {showEditor ? (
          <EditFragmentForm
            closeEditor={() => setShowEditor(false)}
            currentContent={fragment.content}
            updateFragment={updateFragment}
          />
        ) : (
          <Text>{fragment.content}</Text>
        )}
      {/*<Markdown*/}
      {/*  components={{*/}
      {/*    h1: (props: TitleProps) => <Title order={1} {...props} />,*/}
      {/*    h2: (props: TitleProps) => <Title order={2} {...props} />,*/}
      {/*    h3: (props: TitleProps) => <Title order={3} {...props} />,*/}
      {/*    h4: (props: TitleProps) => <Title order={4} {...props} />,*/}
      {/*    h5: (props: TitleProps) => <Title order={5} {...props} />,*/}
      {/*    h6: (props: TitleProps) => <Title order={6} {...props} />,*/}
      {/*    ul: (props: ListProps) => <List listStyleType='disc' {...props} />,*/}
      {/*    li: (props: ListItemProps) => <List.Item {...props} />,*/}
      {/*    p: (props: TextProps) => <Text {...props} />,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {fragment.content}*/}
      {/*</Markdown>*/}
    </Card>
    </Stack>
  )
}
