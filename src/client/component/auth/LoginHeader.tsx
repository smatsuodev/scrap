import { Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'

export default function LoginHeader() {
  return (
    <>
      <Title ta='center'>Scrap にログイン</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        アカウントをお持ちでない方{' '}
        <Anchor size='sm' component={Link} to='/register'>
          新規登録
        </Anchor>
      </Text>
    </>
  )
}
