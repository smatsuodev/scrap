import { Container, Title } from '@mantine/core'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <Container mt='lg'>
      <Title order={2}>最近のスクラップ</Title>
    </Container>
  )
}
