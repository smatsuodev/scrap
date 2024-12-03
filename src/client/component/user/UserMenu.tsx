import type { User } from '@/common/model/user'
import { Group, Menu, Text, UnstyledButton, rem } from '@mantine/core'
import { IconLogout, IconUserCircle } from '@tabler/icons-react'
import { forwardRef } from 'react'

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
        >
          ログアウト
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
