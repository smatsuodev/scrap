type WorkerRequest = 'start' | 'stop'

let currentIntervalId: number | null = null

// 1秒ごとにメインスレッドにメッセージを送る
self.addEventListener('message', (e: MessageEvent<WorkerRequest>) => {
  switch (e.data) {
    case 'start':
      currentIntervalId = setInterval(() => {
        self.postMessage(null)
      }, 1000)
      break
    case 'stop':
      if (currentIntervalId !== null) {
        clearInterval(currentIntervalId)
      }
      break
    default:
      throw e.data satisfies never
  }
})

export default {}
