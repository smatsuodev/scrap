import './tailwind.css'
import '@mantine/core/styles.css'
import { createRoot } from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import { ScrapViewer } from '@/client/component/ScrapViewer'

const theme = createTheme({})

function App() {
  return (
    <MantineProvider theme={theme}>
      <ScrapViewer />
    </MantineProvider>
  )
}
const domNode = document.getElementById('root')
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
}
