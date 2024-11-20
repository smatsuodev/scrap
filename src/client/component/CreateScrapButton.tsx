import { hcWithType } from '@/server/client'
import { ActionIcon, Tooltip } from '@mantine/core'
import { IconPencilPlus } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useMemo } from 'react'

export function CreateScrapButton() {
  const client = useMemo(() => hcWithType('/api'), [])
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
