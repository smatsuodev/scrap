import { CreateScrapButton } from '@/client/component/CreateScrapButton'
import { HomeButton } from '@/client/component/HomeButton'
import { TimerButton } from '@/client/component/timer/TimerButton'
import { AppShell, Container, Group } from '@mantine/core'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Container fluid>
          <Group justify='flex-end' h='100%'>
            <HomeButton />
            <CreateScrapButton />
            <TimerButton />
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
        <TanStackRouterDevtools />
      </AppShell.Main>
    </AppShell>
  ),
})
