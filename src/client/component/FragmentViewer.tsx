import type { Fragment } from '@/client/model/fragment'
import { Card, Text } from '@mantine/core'

interface FragmentViewerProps {
  fragment: Fragment
}

export function FragmentViewer({ fragment }: FragmentViewerProps) {
  return (
    <Card withBorder className='whitespace-pre-wrap'>
      <Text>{fragment.content}</Text>
    </Card>
  )
}
