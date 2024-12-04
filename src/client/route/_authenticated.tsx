import { isAuthenticated } from '@/client/lib/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: '/login',
      })
    }
  },
})
