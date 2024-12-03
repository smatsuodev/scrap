import { hcWithType } from '@/server/client'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false)

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
    setLoading(true)

    const res = await client.auth.login.$post({
      json: {
        userId: values.userId,
        password: values.password,
      },
    })
    if (!res.ok) {
      notifications.show({
        color: 'red',
        title: 'ログインに失敗しました',
        message: 'ID またはパスワードが正しくありません',
      })
      form.setFieldValue('password', '')
      setLoading(false)
      return
    }

    // 遷移するまで loading は解除しない
    await navigate({ to: '/' })
  })

  return (
    <form onSubmit={handleLogin}>
      <TextInput required label='ID' {...form.getInputProps('userId')} />
      <PasswordInput
        required
        label='パスワード'
        {...form.getInputProps('password')}
        mt='md'
      />

      <Button
        type='submit'
        fullWidth
        mt='xl'
        disabled={!form.isValid()}
        loading={loading}
      >
        Log in
      </Button>
    </form>
  )
}
