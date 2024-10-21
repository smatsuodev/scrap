import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './tailwind.css'

function App() {
  return (
    <>
      <FragmentForm />
    </>
  )
}

function FragmentForm() {
  return (
    <form action=''>
      <textarea name='content' id='content' />
      <input type='submit' value='投稿' />
    </form>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type='button' onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  )
}

const ClockButton = () => {
  const [response, setResponse] = useState<string | null>(null)

  const handleClick = async () => {
    const response = await fetch('/api/clock')
    const data = await response.json()
    const headers = Array.from(response.headers.entries()).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value }),
      {},
    )
    const fullResponse = {
      url: response.url,
      status: response.status,
      headers,
      body: data,
    }
    setResponse(JSON.stringify(fullResponse, null, 2))
  }

  return (
    <div>
      <button type='button' onClick={handleClick}>
        Get Server Time
      </button>
      {response && <pre>{response}</pre>}
    </div>
  )
}

const domNode = document.getElementById('root')
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
}
function useForm() {
  throw new Error('Function not implemented.')
}
