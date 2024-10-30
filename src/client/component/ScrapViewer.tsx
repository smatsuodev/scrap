import type { ApiType } from '@/api'
import { FragmentViewer } from '@/client/component/FragmentViewer'
import type { Fragment, FragmentInput } from '@/client/model/fragment'
import { Container, Divider, Stack } from '@mantine/core'
import { hc } from 'hono/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FragmentForm } from './FragmentForm'

type ScrapViewerProps = {
  scrapId: string
}

export function ScrapViewer(props: ScrapViewerProps) {
  const [fragments, setFragments] = useState<Fragment[]>([])

  const client = useMemo(() => hc<ApiType>('/api'), [])

  const fetchFragments = useCallback(async () => {
    const res = await client.scraps[':id'].fragments.$get({
      param: { id: props.scrapId },
    })
    setFragments(await res.json())
  }, [client, props.scrapId])

  const handleSubmit = async (input: FragmentInput) => {
    await client.scraps[':id'].fragments.$post({
      param: { id: props.scrapId },
      json: input,
    })
    await fetchFragments()
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
