import type { Fragment } from '@/client/model/fragment'
import { Card, Text } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

interface FragmentViewerProps {
  fragment: Fragment
}

export function FragmentViewer({ fragment }: FragmentViewerProps) {
  return (
    <Card withBorder className='whitespace-pre-wrap'>
      <Text>{fragment.content}</Text>
      <IconEdit />
    </Card>
  )
}
