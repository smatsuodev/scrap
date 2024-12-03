import RegisterForm from '@/client/component/auth/RegisterForm'
import RegisterHeader from '@/client/component/auth/RegisterHeader'
import { Container, Paper } from '@mantine/core'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/register')({
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
