import RegisterForm from '@/client/component/auth/RegisterForm'
import RegisterHeader from '@/client/component/auth/RegisterHeader'
import { isAuthenticated } from '@/client/lib/auth'
import { Container, Paper } from '@mantine/core'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    if (await isAuthenticated()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RegisterPage,
})

export function RegisterPage() {
  return (
    <Container size={450} my={40}>
      <RegisterHeader />
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <RegisterForm />
      </Paper>
    </Container>
  )
}
