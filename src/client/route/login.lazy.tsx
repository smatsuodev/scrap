import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})

export function LoginPage() {
  return (
    <Container size={450} my={40}>
      <Title ta='center'>Log in to Scrap</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        アカウントをお持ちでない方{' '}
        <Anchor size='sm' component='button'>
          新規登録
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <TextInput label='ID' required />
        <PasswordInput label='パスワード' required mt='md' />

        <Group justify='space-between' mt='lg'>
          <Checkbox label='IDを記憶する' />
          <Anchor component='button' size='sm'>
            パスワードをお忘れですか?
          </Anchor>
        </Group>

        <Button fullWidth mt='xl'>
          Log in
        </Button>
      </Paper>
    </Container>
  )
}
