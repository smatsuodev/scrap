import { Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'

export default function RegisterHeader() {
  return (
    <>
      <Title ta='center'>Scrap に新規登録</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        既にアカウントをお持ちの方{' '}
        <Anchor size='sm' component={Link} to='/login'>
          ログイン
        </Anchor>
      </Text>
    </>
  )
}
