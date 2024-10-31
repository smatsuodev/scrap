import type { ApiType } from '@/api'
import { FragmentViewer } from '@/client/component/FragmentViewer'
import type { FragmentInput } from '@/client/model/fragment'
import type { Scrap } from '@/client/model/scrap'
import { Container, Divider, Stack, Title } from '@mantine/core'
import { hc } from 'hono/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FragmentForm } from './FragmentForm'

type ScrapViewerProps = {
  scrapId: string
}

export function ScrapViewer(props: ScrapViewerProps) {
  const [scrap, setScrap] = useState<Scrap | null>(null)

  const client = useMemo(() => hc<ApiType>('/api'), [])

  const fetchScrap = useCallback(async () => {
    const res = await client.scraps[':id'].$get({
      param: { id: props.scrapId },
    })
    return await res.json()
  }, [client, props.scrapId])

  const handleSubmit = async (input: FragmentInput) => {
    await client.scraps[':id'].fragments.$post({
      param: { id: props.scrapId },
      json: input,
    })
    setScrap(await fetchScrap())
  }

  useEffect(() => {
    fetchScrap().then(setScrap)
  }, [fetchScrap])

  return (
    <Container mt='lg'>
      <Stack>
        <Title>{scrap?.title}</Title>
        {scrap?.fragments.map((fragment) => (
          <FragmentViewer key={fragment.id} fragment={fragment} />
        ))}
      </Stack>
      <Divider my='lg' />
      <FragmentForm onSubmit={handleSubmit} />
    </Container>
  )
}
