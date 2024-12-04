import { CreateScrapButton } from '@/client/component/CreateScrapButton'
import { HomeButton } from '@/client/component/HomeButton'
import { TimerButton } from '@/client/component/TimerButton'
import UserMenu from '@/client/component/user/UserMenu'
import { currentUser } from '@/client/lib/auth'
import { AppShell, Container, Group } from '@mantine/core'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  loader: () => currentUser(),
  component: RootPage,
})

export function RootPage() {
  const currentUser = Route.useLoaderData()
  const authenticated = currentUser !== null

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Container fluid>
          <Group justify='flex-end' h='100%'>
            <HomeButton />
            {authenticated && <CreateScrapButton />}
            <TimerButton />
            {authenticated && <UserMenu currentUser={currentUser} />}
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
        <TanStackRouterDevtools />
      </AppShell.Main>
    </AppShell>
  )
}
