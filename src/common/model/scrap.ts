import type { Fragment } from '@/common/model/fragment'
import type { UserId } from '@/common/model/user'

export interface Scrap {
  id: string
  title: string
  fragments: Fragment[]
  updatedAt: string
  ownerId: UserId
}
