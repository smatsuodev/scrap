import type { Fragment } from '@/model/fragment'

export interface Scrap {
  id: string
  title: string
  fragments: Fragment[]
  updatedAt: string
}
