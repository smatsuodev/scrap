import { hcWithType } from '@/server/client'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const client = hcWithType('/api')
    const res = await client.users.me.$get()
    if (res.status === 401) {
      throw redirect({
        to: '/login',
      })
    }
  },
})
