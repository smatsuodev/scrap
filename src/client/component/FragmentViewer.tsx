import type { Fragment } from '@/client/model/fragment'
import { Button, Card, Text } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import EditFragmentForm from '@/client/component/EditFragmentForm'

interface FragmentViewerProps {
  fragment: Fragment
  updateFragment: (content: string) => Promise<void>
}

export function FragmentViewer({
  fragment,
  updateFragment,
}: FragmentViewerProps) {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <Card withBorder className='whitespace-pre-wrap'>
      {showEditor ? (
        <EditFragmentForm
          closeEditor={() => setShowEditor(false)}
          currentContent={fragment.content}
          updateFragment={updateFragment}
        />
      ) : (
        <>
          <Text>{fragment.content}</Text>
          <Button
            leftSection={<IconEdit />}
            onClick={() => setShowEditor(true)}
          />
        </>
      )}
    </Card>
  )
}
