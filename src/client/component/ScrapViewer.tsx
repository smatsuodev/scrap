import { Container, Divider, Stack } from '@mantine/core'
import { FragmentForm } from './FragmentForm'
import type { Fragment, FragmentInput } from '@/client/model/fragment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FragmentViewer } from '@/client/component/FragmentViewer'
import { hc } from 'hono/client'
import type { ApiType } from '@/api'

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

  useEffect(() => {
    fetchFragments()
  }, [fetchFragments])

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
