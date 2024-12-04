import RegisterForm from '@/client/component/auth/RegisterForm'
import RegisterHeader from '@/client/component/auth/RegisterHeader'
import { Container, Paper } from '@mantine/core'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  beforeLoad: async ({ context }) => {
    if (await context.loginUserRepository.getUser()) {
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
