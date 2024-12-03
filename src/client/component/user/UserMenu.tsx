import type { User } from '@/common/model/user'
import { hcWithType } from '@/server/client'
import { Group, Menu, Text, UnstyledButton, rem } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconLogout, IconUserCircle } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { forwardRef, useMemo } from 'react'

type UserButtonProps = {
  userId: string
}

/**
 * Menu.Target として使えるようにするために、forwardRef や others の受け渡しが必要
 * refs: https://mantine.dev/core/menu/#target-children
 */
const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ userId, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        color: 'var(--mantine-color-text)',
      }}
      {...others}
    >
      <Group gap='6px'>
        <IconUserCircle size='28px' />
        <Text>{userId}</Text>
      </Group>
    </UnstyledButton>
  ),
)

export type UserMenuProps = {
  currentUser: User
}

export default function UserMenu(props: UserMenuProps) {
  const client = useMemo(() => hcWithType('/api'), [])
  const navigate = useNavigate()

  const handleLogout = async () => {
    const res = await client.auth.logout.$post()
    if (!res.ok) {
      notifications.show({
        color: 'red',
        title: 'ログアウトに失敗しました',
        message: 'もう一度お試しください',
      })
      return
    }

    await navigate({ to: '/login' })
  }

  return (
    <Menu shadow='md'>
      <Menu.Target>
        <UserButton userId={props.currentUser.id} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <IconLogout style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={handleLogout}
        >
          ログアウト
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
