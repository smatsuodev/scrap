import type { Brand } from '@/common/brand'

export type FragmentId = Brand<number, 'FragmentId'>

export interface Fragment {
  id: FragmentId
  content: string
}

export type FragmentInput = Omit<Fragment, 'id'>
