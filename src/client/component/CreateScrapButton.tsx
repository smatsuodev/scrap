import type { ApiType } from '@/api'
import { ActionIcon, Tooltip } from '@mantine/core'
import { IconPencilPlus } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useCallback, useMemo } from 'react'

export function CreateScrapButton() {
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
    <Tooltip label='新しいスクラップ'>
      <ActionIcon size='lg' variant='default' onClick={handleClick}>
        <IconPencilPlus />
      </ActionIcon>
    </Tooltip>
  )
}
