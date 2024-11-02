import type { ApiType } from '@/api'
import { Button } from '@mantine/core'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useCallback, useMemo } from 'react'

export const Route = createLazyFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const client = useMemo(() => hc<ApiType>('/api'), [])
  const navigate = useNavigate()

  const handleClick = useCallback(async () => {
    const res = await client.scraps.$post({
      json: { title: '無題のスクラップ' },
    })
    const scrap = await res.json()
    await navigate({ to: `/scraps/${scrap.id}` })
  }, [client, navigate])

  return (
    <>
      <Button onClick={handleClick}>新しいスクラップ</Button>
    </>
  )
}
