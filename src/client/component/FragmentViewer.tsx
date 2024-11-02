import type { Fragment } from '@/client/model/fragment'
import {
  Card,
  List,
  type ListItemProps,
  type ListProps,
  Title,
  type TitleProps,
} from '@mantine/core'
import { Remark } from 'react-remark'

interface FragmentViewerProps {
  fragment: Fragment
}

export function FragmentViewer({ fragment }: FragmentViewerProps) {
  return (
    <Card withBorder className='whitespace-pre-wrap'>
      <Remark
        rehypeReactOptions={{
          components: {
            h1: (props: TitleProps) => <Title order={1} {...props} />,
            h2: (props: TitleProps) => <Title order={2} {...props} />,
            h3: (props: TitleProps) => <Title order={3} {...props} />,
            h4: (props: TitleProps) => <Title order={4} {...props} />,
            h5: (props: TitleProps) => <Title order={5} {...props} />,
            h6: (props: TitleProps) => <Title order={6} {...props} />,
            ul: (props: ListProps) => <List listStyleType='disc' {...props} />,
            li: (props: ListItemProps) => <List.Item {...props} />,
          },
        }}
      >
        {fragment.content}
      </Remark>
    </Card>
  )
}
