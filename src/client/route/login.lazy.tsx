import LoginForm from '@/client/component/LoginForm'
import LoginHeader from '@/client/component/LoginHeader'
import { Container, Paper } from '@mantine/core'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})

export function LoginPage() {
  return (
    <Container size={450} my={40}>
      <LoginHeader />
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <LoginForm />
      </Paper>
    </Container>
  )
}
