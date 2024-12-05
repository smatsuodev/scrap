import type { User } from '@/common/model/user'
import type {
  AuthenticatorTransportFuture,
  Base64URLString,
  CredentialDeviceType,
} from '@simplewebauthn/types'

export type Passkey = {
  id: Base64URLString
  publicKey: Uint8Array
  user: User
  webauthnUserId: Base64URLString
  counter: bigint
  isBackedUp: boolean
  deviceType: CredentialDeviceType
  transports: AuthenticatorTransportFuture[] | null
}
