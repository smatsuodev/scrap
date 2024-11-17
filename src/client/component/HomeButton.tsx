import { ActionIcon, Tooltip } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'

export function HomeButton() {
  const navigate = useNavigate()
  const handleClick = useCallback(async () => {
    await navigate({ to: '/' })
  }, [navigate])

  return (
    <Tooltip label='ホーム'>
      <ActionIcon size='lg' variant='default' onClick={handleClick}>
        <IconHome />
      </ActionIcon>
    </Tooltip>
  )
}
