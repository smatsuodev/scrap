import { Container, Divider, Stack } from '@mantine/core'
import { FragmentForm } from './FragmentForm'
import type { Fragment } from '@/client/model/fragment'
import { useState } from 'react'
import { FragmentViewer } from '@/client/component/FragmentViewer'

export function ScrapViewer() {
  const [fragments, setFragments] = useState<Fragment[]>([
    { content: 'Hello world!\nHello world!\nHello world!' },
    { content: 'Hello world!\nHello world!\nHello world!' },
    { content: 'Hello world!\nHello world!\nHello world!' },
  ])
  const handleSubmit = (newFragment: Fragment) => {
    setFragments([...fragments, newFragment])
  }

  return (
    <Container mt='lg'>
      <Stack>
        {fragments.map((fragment, index) => (
          <FragmentViewer key={index} fragment={fragment} />
        ))}
      </Stack>
      <Divider my='lg' />
      <FragmentForm onSubmit={handleSubmit} />
    </Container>
  )
}
