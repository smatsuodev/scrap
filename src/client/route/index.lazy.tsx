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
  UnstyledButton,
} from '@mantine/core'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()

  useEffect(() => {
    client.scraps.$get().then(async (res) => {
      setScraps(await res.json())
    })
  }, [client])

  if (scraps === null) {
    return (
      <Center>
        <Loader type='bars' />
      </Center>
    )
  }

  return (
    <Stack>
      {...scraps.map((scrap) => {
        return (
          <>
            <UnstyledButton
              key={scrap.id}
              onClick={() => navigate({ to: `/scraps/${scrap.id}` })}
            >
              <Stack my='8px' gap='8px'>
                <Text c='dimmed'>{scrap.updatedAt}</Text>
                <Title order={3}>{scrap.title}</Title>
              </Stack>
            </UnstyledButton>
            <Divider key={`${scrap.id}-divider`} />
          </>
        )
      })}
    </Stack>
  )
}