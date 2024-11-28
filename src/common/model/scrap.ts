import type { Fragment } from '@/common/model/fragment'

export interface Scrap {
  id: string
  title: string
  fragments: Fragment[]
  updatedAt: string
}
