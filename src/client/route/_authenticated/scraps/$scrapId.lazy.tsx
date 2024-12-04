import { ScrapViewer } from '@/client/component/ScrapViewer'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/scraps/$scrapId')({
  component: ScrapPage,
})

function ScrapPage() {
  const { scrapId } = Route.useParams()
  return <ScrapViewer scrapId={scrapId} />
}
