import { Container, Divider, Stack } from '@mantine/core'
import { FragmentForm } from './FragmentForm'
import type { Fragment, FragmentInput } from '@/client/model/fragment'
import { useState } from 'react'
import { FragmentViewer } from '@/client/component/FragmentViewer'

export function ScrapViewer() {
  const [fragments, setFragments] = useState<Fragment[]>([
    { id: 1, content: 'Hello world!\nHello world!\nHello world!' },
    { id: 2, content: 'Hello world!\nHello world!\nHello world!' },
    { id: 3, content: 'Hello world!\nHello world!\nHello world!' },
  ])
  const handleSubmit = (input: FragmentInput) => {
    setFragments([...fragments, { id: fragments.length + 1, ...input }])
  }

  return (
    <Container mt='lg'>
      <Stack>
        {fragments.map((fragment) => (
          <FragmentViewer key={fragment.id} fragment={fragment} />
        ))}
      </Stack>
      <Divider my='lg' />
      <FragmentForm onSubmit={handleSubmit} />
    </Container>
  )
}
