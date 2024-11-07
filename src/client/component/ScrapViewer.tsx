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
import { IconPencil } from '@tabler/icons-react'
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

  const updateFragment = async (id: number, content: string) => {
    await client.scraps[':scrapId'].fragments[':fragmentId'].$put({
      param: {
        scrapId: props.scrapId,
        fragmentId: id.toString(),
      },
      json: { content },
    })

    // TODO: Immer で置き換えたいかも
    setScrap((scrap) => {
      if (!scrap) return scrap
      return {
        ...scrap,
        fragments: scrap.fragments.map((fragment) =>
          fragment.id === id ? { ...fragment, content } : fragment,
        ),
      }
    })
  }

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
              <IconPencil />
            </ActionIcon>
          </Group>
        )}
        {scrap?.fragments.map((fragment) => (
          <FragmentViewer
            key={fragment.id}
            fragment={fragment}
            updateFragment={(content: string) =>
              updateFragment(fragment.id, content)
            }
          />
        ))}
      </Stack>
      <Divider my='lg' />
      <FragmentForm onSubmit={handleSubmitFragment} />
    </Container>
  )
}
