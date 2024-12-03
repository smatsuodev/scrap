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
import { isNotEmpty, useForm } from '@mantine/form'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})

export function LoginPage() {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      userId: '',
      password: '',
    },
    validate: {
      userId: isNotEmpty('1文字以上入力してください'),
      password: isNotEmpty('1文字以上入力してください'),
    },
    validateInputOnBlur: true,
  })

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
        <form>
          <TextInput required label='ID' {...form.getInputProps('userId')} />
          <PasswordInput
            required
            label='パスワード'
            {...form.getInputProps('password')}
            mt='md'
          />

          <Group justify='space-between' mt='lg'>
            <Checkbox label='IDを記憶する' />
            <Anchor component='button' size='sm'>
              パスワードをお忘れですか?
            </Anchor>
          </Group>

          <Button fullWidth mt='xl' disabled={!form.isValid()}>
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
