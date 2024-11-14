import { Code, List, Text, Title } from '@mantine/core'
import type { Root, RootContent } from 'mdast'
import { useEffect, useState } from 'react'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'

type MarkdownProps = {
  markdown: string
}

export function Markdown({ markdown }: MarkdownProps) {
  const [rootNode, setRootNode] = useState<Root>()

  useEffect(() => {
    parseMarkdown(markdown).then(setRootNode, console.error)
  }, [markdown])

  return rootNode ? (
    <NodeRenderer nodes={rootNode.children} />
  ) : (
    <Text c='gray' fs='italic'>
      読み込みに失敗しました
    </Text>
  )
}

type NodeRendererProps = {
  nodes: RootContent[]
}

function NodeRenderer({ nodes }: NodeRendererProps) {
  return (
    <>
      {...nodes.map((node) => {
        switch (node.type) {
          case 'text':
            return node.value

          case 'paragraph':
            return (
              <Text>
                <NodeRenderer nodes={node.children} />
              </Text>
            )

          case 'heading':
            return (
              <Title order={node.depth}>
                <NodeRenderer nodes={node.children} />
              </Title>
            )

          case 'list':
            return (
              <List listStyleType='disc'>
                <NodeRenderer nodes={node.children} />
              </List>
            )

          case 'listItem':
            return (
              <List.Item>
                <NodeRenderer nodes={node.children} />
              </List.Item>
            )

          case 'inlineCode':
            return <Code>{node.value}</Code>

          case 'code':
            return <Code block>{node.value}</Code>
        }
      })}
    </>
  )
}

async function parseMarkdown(markdownText: string): Promise<Root> {
  const parser = remark().use(remarkGfm)
  // 実際にRoot型のオブジェクトが返ってきているが、remark側で肩が上手く効いていないためキャストする
  return (await parser.run(parser.parse(markdownText))) as Root
}
