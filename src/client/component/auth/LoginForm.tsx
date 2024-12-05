import { userIdSchema, userPasswordSchema } from '@/common/model/user'
import { hcWithType } from '@/server/client'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useMemo, useState } from 'react'
import { z } from 'zod'

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const formSchema = z.object({
    userId: userIdSchema,
    password: userPasswordSchema,
  })
  type FormValues = z.infer<typeof formSchema>
  const form = useForm<FormValues>({
    mode: 'controlled',
    initialValues: {
      userId: '',
      password: '',
    },
    validate: zodResolver(formSchema),
    validateInputOnChange: true,
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

    notifications.show({
      color: 'blue',
      title: 'ログインしました',
      message: 'トップページに遷移します',
    })

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
        ログイン
      </Button>
    </form>
  )
}
