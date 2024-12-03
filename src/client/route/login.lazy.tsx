import { hcWithType } from '@/server/client'
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})

export function LoginPage() {
  const navigate = useNavigate()
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
  const client = useMemo(() => hcWithType('/api'), [])

  const handleLogin = form.onSubmit(async (values) => {
    const res = await client.auth.login.$post({
      json: {
        userId: values.userId,
        password: values.password,
      },
    })
    if (!res.ok) {
      form.setFieldValue('password', '')
      return
    }

    await navigate({ to: '/' })
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
        <form onSubmit={handleLogin}>
          <TextInput required label='ID' {...form.getInputProps('userId')} />
          <PasswordInput
            required
            label='パスワード'
            {...form.getInputProps('password')}
            mt='md'
          />

          <Button fullWidth mt='xl' disabled={!form.isValid()} type='submit'>
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
