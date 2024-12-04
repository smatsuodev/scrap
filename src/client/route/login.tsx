import LoginForm from '@/client/component/auth/LoginForm'
import LoginHeader from '@/client/component/auth/LoginHeader'
import { Container, Paper } from '@mantine/core'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (await context.loginUserRepository.getUser()) {
      throw redirect({
        to: '/',
      })
    }
  },
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
