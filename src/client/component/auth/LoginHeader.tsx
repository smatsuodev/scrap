import { Anchor, Text, Title } from '@mantine/core'

export default function LoginHeader() {
  return (
    <>
      <Title ta='center'>Log in to Scrap</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        アカウントをお持ちでない方{' '}
        <Anchor size='sm' component='button'>
          新規登録
        </Anchor>
      </Text>
    </>
  )
}
