import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    if (!(await context.loginUserRepository.getUser())) {
      throw redirect({
        to: '/login',
      })
    }
  },
})
