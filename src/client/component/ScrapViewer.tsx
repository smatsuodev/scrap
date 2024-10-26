import type { ApiType } from '@/api'
import { FragmentViewer } from '@/client/component/FragmentViewer'
import type { Fragment, FragmentInput } from '@/client/model/fragment'
import { Container, Divider, Stack } from '@mantine/core'
import { hc } from 'hono/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FragmentForm } from './FragmentForm'

export function ScrapViewer() {
  const [fragments, setFragments] = useState<Fragment[]>([])

  const client = useMemo(() => hc<ApiType>('/api'), [])

  const fetchFragments = useCallback(async () => {
    const res = await client.fragments.$get()
    setFragments(await res.json())
  }, [client])

  const handleSubmit = async (input: FragmentInput) => {
    await client.fragments.$post({ json: input })
    fetchFragments()
  }

  const updateFragment = async (id: number, content: string) => {
    await client.fragments[':id'].$put({
      param: { id: id.toString() },
      json: { content },
    })

    setFragments((fragments) =>
      fragments.map((fragment) =>
        fragment.id === id ? { ...fragment, content } : fragment,
      ),
    )
  }

  useEffect(() => {
    fetchFragments()
  }, [fetchFragments])

  return (
    <Container mt='lg'>
      <Stack>
        {fragments.map((fragment) => (
          <FragmentViewer
            key={fragment.id}
            fragment={fragment}
            updateFragment={(content: string) =>
              updateFragment(fragment.id, content)
            }
          />
        ))}
      </Stack>
      <Divider my='lg' />
      <FragmentForm onSubmit={handleSubmit} />
    </Container>
  )
}
