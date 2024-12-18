import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'
import { LoginUserRepository } from '@/client/repository/loginUser'
import { routeTree } from '@/client/routeTree.gen'
import { hcWithType } from '@/server/client'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'

const theme = createTheme({})

const apiClient = hcWithType('/api')

const router = createRouter({
  routeTree,
  context: {
    loginUserRepository: new LoginUserRepository(apiClient),
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  )
}
const domNode = document.getElementById('root')
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
}
