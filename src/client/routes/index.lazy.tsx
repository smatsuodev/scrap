import { ScrapViewer } from '@/client/component/ScrapViewer'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return <ScrapViewer />
}
