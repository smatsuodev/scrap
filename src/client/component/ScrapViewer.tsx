import type { ApiType } from '@/api'
import { FragmentViewer } from '@/client/component/FragmentViewer'
import type { FragmentInput } from '@/client/model/fragment'
import type { Scrap } from '@/client/model/scrap'
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler } from '@mantine/hooks'
import { IconEdit } from '@tabler/icons-react'
import { hc } from 'hono/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FragmentForm } from './FragmentForm'

type ScrapViewerProps = {
  scrapId: string
}

export function ScrapViewer(props: ScrapViewerProps) {
  const [scrap, setScrap] = useState<Scrap | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const client = useMemo(() => hc<ApiType>('/api'), [])

  const fetchScrap = useCallback(async () => {
    const res = await client.scraps[':id'].$get({
      param: { id: props.scrapId },
    })
    return await res.json()
  }, [client, props.scrapId])

  const handleSubmitFragment = async (input: FragmentInput) => {
    await client.scraps[':id'].fragments.$post({
      param: { id: props.scrapId },
      json: input,
    })
    setScrap(await fetchScrap())
  }

  const titleForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
    },
    validate: {
      title: (title) => (title.length > 0 ? null : '1文字以上入力してください'),
    },
  })

  const handleEditTitleButtonClicked = useCallback(() => {
    setIsEditingTitle(true)
    titleForm.setFieldValue('title', scrap?.title ?? '')
  }, [titleForm, scrap])

  const handleTitleSubmit = titleForm.onSubmit(async (values) => {
    await client.scraps[':id'].$put({
      json: values,
      param: { id: props.scrapId },
    })
    setScrap(await fetchScrap())
    setIsEditingTitle(false)
  })

  const handleCancelEditTitleButtonClicked = useCallback(() => {
    setIsEditingTitle(false)
    titleForm.reset()
  }, [titleForm])

  useEffect(() => {
    fetchScrap().then(setScrap)
  }, [fetchScrap])

  return (
    <Container mt='lg'>
      <Stack>
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit}>
            <Grid>
              <Grid.Col span='auto'>
                <TextInput
                  placeholder='タイトル'
                  key={titleForm.key('title')}
                  {...titleForm.getInputProps('title')}
                  onKeyDown={getHotkeyHandler([
                    ['mod+Enter', handleTitleSubmit],
                  ])}
                />
              </Grid.Col>
              <Grid.Col span='content'>
                <Button type='submit'>保存</Button>
              </Grid.Col>
              <Grid.Col span='content'>
                <Button
                  variant='default'
                  onClick={handleCancelEditTitleButtonClicked}
                >
                  キャンセル
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        ) : (
          <Group>
            <Title>{scrap?.title}</Title>
            <ActionIcon
              variant='default'
              onClick={handleEditTitleButtonClicked}
            >
              <IconEdit />
            </ActionIcon>
          </Group>
        )}
        {scrap?.fragments.map((fragment) => (
          <FragmentViewer key={fragment.id} fragment={fragment} />
        ))}
      </Stack>
      <Divider my='lg' />
      <FragmentForm onSubmit={handleSubmitFragment} />
    </Container>
  )
}
