import type { ApiType } from '@/api'
import type { Scrap } from '@/model/scrap'
import {
  Center,
  Container,
  Divider,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { createLazyFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useEffect, useMemo, useState } from 'react'

export const Route = createLazyFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <Container mt='lg'>
      <Title order={2} mb='md'>
        最近のスクラップ
      </Title>
      <RecentScrapList />
    </Container>
  )
}

function RecentScrapList() {
  const client = useMemo(() => hc<ApiType>('/api'), [])
  const [scraps, setScraps] = useState<Scrap[] | null>(null)

  useEffect(() => {
    client.scraps.$get().then(async (res) => {
      setScraps(await res.json())
    })
  })

  if (scraps === null) {
    return (
      <Center>
        <Loader type='bars' />
      </Center>
    )
  }

  return (
    <Stack>
      {...scraps.map((scrap) => (
        <>
          <Stack key={scrap.id} my='xs'>
            <Title order={3}>{scrap.title}</Title>
            <Text c='dimmed' truncate='end'>
              {scrap.fragments[0]?.content ?? ''}
            </Text>
          </Stack>
          <Divider key={scrap.id} />
        </>
      ))}
    </Stack>
  )
}
