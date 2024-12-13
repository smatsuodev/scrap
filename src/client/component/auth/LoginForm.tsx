import usePasskey from '@/client/hook/usePasskey'
import { hcWithType } from '@/server/client'
import { Button, Divider, Group, PasswordInput, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { browserSupportsWebAuthnAutofill } from '@simplewebauthn/browser'
import { IconKeyFilled } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function LoginForm() {
  const [loginLoading, setLoginLoading] = useState<boolean>(false)
  const [passkeyLoading, setPasskeyLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { registerPasskey, loginWithPasskey } = usePasskey()
  const manualPasskeyLoginStartedRef = useRef(false)

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

  const onLoginSuccess = useCallback(async () => {
    notifications.show({
      color: 'blue',
      title: 'ログインしました',
      message: 'トップページに遷移します',
    })
    await navigate({ to: '/' })
  }, [navigate])

  const handleLogin = form.onSubmit(async (values) => {
    setLoginLoading(true)

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
      setLoginLoading(false)
      return
    }

    // 遷移するまで loading は解除しない
    // 下の処理はあえて待たない
    onLoginSuccess()

    // 失敗してもログインには影響しないので、UI にエラーを通知したりしない
    try {
      await registerPasskey()
    } catch (e) {
      console.log(e)
    }
  })

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true)
    manualPasskeyLoginStartedRef.current = true

    try {
      await loginWithPasskey({ useBrowserAutofill: false })
      // 遷移するまで loading は解除しない
      await onLoginSuccess()
    } catch (e) {
      notifications.show({
        color: 'red',
        title: 'パスキーでのログインに失敗しました',
        message: 'もう一度お試しください',
      })
      setPasskeyLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (await browserSupportsWebAuthnAutofill()) {
        try {
          await loginWithPasskey({ useBrowserAutofill: true })
          await onLoginSuccess()
        } catch (e) {
          /**
           * ボタンから手動でログインを始めるとエラーが発生する
           * その場合はエラーを通知しない
           *
           * effect の再実行は不要なため、passkeyLoading を使った判定はできない
           * 依存配列から除いても、render 前の値しか参照できない
           */
          if (!manualPasskeyLoginStartedRef.current) {
            notifications.show({
              color: 'red',
              title: 'パスキーでのログインに失敗しました',
              message: 'もう一度お試しください',
            })
          }
        }
      }
    })()
  }, [onLoginSuccess, loginWithPasskey])

  return (
    <>
      <form onSubmit={handleLogin}>
        <TextInput
          required
          label='ID'
          {...form.getInputProps('userId')}
          autoComplete='username webauthn'
        />
        <PasswordInput
          required
          label='パスワード'
          {...form.getInputProps('password')}
          mt='md'
          autoComplete='current-password'
        />

        <Button
          type='submit'
          fullWidth
          mt='xl'
          disabled={!form.isValid()}
          loading={loginLoading}
        >
          ログイン
        </Button>
      </form>

      <Divider label='または' labelPosition='center' my='lg' />

      <Group grow mb='md' mt='md'>
        <Button
          fullWidth
          color='violet'
          leftSection={<IconKeyFilled size='24px' />}
          onClick={handlePasskeyLogin}
          loading={passkeyLoading}
        >
          パスキーでログイン
        </Button>
      </Group>
    </>
  )
}
