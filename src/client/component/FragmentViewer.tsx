import type { Fragment } from '@/client/model/fragment'
import {
  Card,
  List,
  type ListItemProps,
  type ListProps,
  Text,
  type TextProps,
  Title,
  type TitleProps,
} from '@mantine/core'
import Markdown from 'react-markdown'
import classes from './FragmentViewer.module.css'

interface FragmentViewerProps {
  fragment: Fragment
}

export function FragmentViewer({ fragment }: FragmentViewerProps) {
  return (
    <Card withBorder>
      <Markdown
        components={{
          h1: (props: TitleProps) => <Title mb='1rem' order={1} {...props} />,
          h2: (props: TitleProps) => <Title mb='1rem' order={2} {...props} />,
          h3: (props: TitleProps) => <Title mb='1rem' order={3} {...props} />,
          h4: (props: TitleProps) => <Title mb='1rem' order={4} {...props} />,
          h5: (props: TitleProps) => <Title mb='1rem' order={5} {...props} />,
          h6: (props: TitleProps) => <Title mb='1rem' order={6} {...props} />,
          ul: (props: ListProps) => (
            <List
              className={classes.markdownList}
              listStyleType='disc'
              {...props}
            />
          ),
          li: (props: ListItemProps) => <List.Item {...props} />,
          p: (props: TextProps) => <Text mb='1rem' {...props} />,
        }}
      >
        {fragment.content}
      </Markdown>
    </Card>
  )
}
