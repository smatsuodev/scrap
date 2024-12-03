import type { Brand } from '@/common/brand'

export type UserId = Brand<string, 'UserId'>

export interface User {
  id: UserId
}
