import { userIdSchema, userPasswordSchema } from '@/common/model/user'
import { hcWithType } from '@/server/client'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useMemo, useState } from 'react'
import { z } from 'zod'

export default function RegisterForm() {
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
    validateInputOnBlur: true,
  })
  const client = useMemo(() => hcWithType('/api'), [])

  const handleRegister = form.onSubmit(async (values) => {
    setLoading(true)

    const res = await client.auth.register.$post({
      json: {
        userId: values.userId,
        password: values.password,
      },
    })
    if (!res.ok) {
      const showError = (message: string) =>
        notifications.show({
          color: 'red',
          title: '新規登録に失敗しました',
          message,
        })
      if (res.status === 409) {
        showError('ID が既に使用されています')
      } else {
        showError('入力内容を確認してください')
      }

      form.reset()
      setLoading(false)
      return
    }

    notifications.show({
      color: 'blue',
      title: '新規登録が完了しました',
      message: 'ログインしてください',
    })

    // 遷移するまで loading は解除しない
    await navigate({ to: '/login' })
  })

  return (
    <form onSubmit={handleRegister}>
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
        新規登録
      </Button>
    </form>
  )
}
