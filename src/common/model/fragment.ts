import type { Brand } from '@/common/brand'
import type { UserId } from '@/common/model/user'

export type FragmentId = Brand<number, 'FragmentId'>

export interface Fragment {
  id: FragmentId
  scrapId: string
  authorId: UserId
  content: string
}

export type FragmentInput = Omit<Fragment, 'id'>
