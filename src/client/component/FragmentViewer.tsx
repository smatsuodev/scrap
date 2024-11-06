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
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import classes from './FragmentViewer.module.css'

interface FragmentViewerProps {
  fragment: Fragment
}

export function FragmentViewer({ fragment }: FragmentViewerProps) {
  return (
    <Card withBorder className={classes.markdown}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: (props: TitleProps) => <Title order={1} {...props} />,
          h2: (props: TitleProps) => <Title order={2} {...props} />,
          h3: (props: TitleProps) => <Title order={3} {...props} />,
          h4: (props: TitleProps) => <Title order={4} {...props} />,
          h5: (props: TitleProps) => <Title order={5} {...props} />,
          h6: (props: TitleProps) => <Title order={6} {...props} />,
          ul: (props: ListProps) => (
            <List type='unordered' listStyleType='disc' {...props} />
          ),
          // ol要素のtypeとList要素のtypeが競合するため、ListPropsからtypeを除外
          ol: (props: Omit<ListProps, 'type'>) => (
            <List type='ordered' listStyleType='decimal' {...props} />
          ),
          li: (props: ListItemProps) => <List.Item {...props} />,
          p: (props: TextProps) => <Text {...props} />,
        }}
      >
        {fragment.content}
      </Markdown>
    </Card>
  )
}
