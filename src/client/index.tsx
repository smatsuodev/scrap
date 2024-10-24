import './tailwind.css'
import '@mantine/core/styles.css'
import { ScrapViewer } from '@/client/component/ScrapViewer'
import { MantineProvider, createTheme } from '@mantine/core'
import { createRoot } from 'react-dom/client'

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
