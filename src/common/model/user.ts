import type { Brand } from '@/common/brand'
import { z } from 'zod'

export type UserId = Brand<string, 'UserId'>

export interface User {
  id: UserId
}

export const userIdSchema = z
  .string()
  .min(1, 'IDは1文字以上で入力してください')
  .max(20, 'IDは20文字以下で入力してください')
  .regex(/^[a-zA-Z0-9_]+$/, 'IDは半角英数字とアンダースコアのみ使用できます')
// 誤って両端に空白を含めてもログインできたほうが便利なので、最初に trim する
export const userPasswordSchema = z
  .string()
  .trim()
  .min(8, 'パスワードは8文字以上で入力してください')
