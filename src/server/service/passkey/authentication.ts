import type { UserId } from '@/common/model/user'
import type { IPasskeyRepository } from '@/server/repository/passkey'
import type { IPasskeyAuthenticationSessionRepository } from '@/server/repository/passkey/authenticationSession'
import type { IUserRepository } from '@/server/repository/user'
import { origin, rpID } from '@/server/service/passkey/rp'
import {
  type VerifiedAuthenticationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types'

export type GenerateOptionsInput = {
  userId: UserId
}
export type VerifyInput = {
  userId: UserId
  body: AuthenticationResponseJSON
}

export type IPasskeyAuthenticationService = {
  generateOptions(
    input: GenerateOptionsInput,
  ): Promise<PublicKeyCredentialRequestOptionsJSON>
  verify(
    input: VerifyInput,
  ): Promise<Pick<VerifiedAuthenticationResponse, 'verified'>>
}

export class PasskeyAuthenticationService
  implements IPasskeyAuthenticationService
{
  constructor(
    private userRepo: IUserRepository,
    private passkeyRepo: IPasskeyRepository,
    private authenticationSessionRepo: IPasskeyAuthenticationSessionRepository,
  ) {}

  async generateOptions(
    input: GenerateOptionsInput,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const user = await this.userRepo.find(input.userId)
    if (!user) {
      throw new Error('User not found')
    }
    const userPasskeys = await this.passkeyRepo.findByUserId(user.id)

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports ?? undefined,
      })),
    })

    await this.authenticationSessionRepo.store(user.id, {
      challenge: options.challenge,
    })

    return options
  }

  async verify(
    input: VerifyInput,
  ): Promise<Pick<VerifiedAuthenticationResponse, 'verified'>> {
    const user = await this.userRepo.find(input.userId)
    if (!user) {
      throw new Error('User not found')
    }
    const authenticationSession = await this.authenticationSessionRepo.load(
      user.id,
    )
    if (!authenticationSession) {
      throw new Error('No authentication session found')
    }
    const passkey = await this.passkeyRepo.findByWebauthnUserIdAndUserId(
      input.body.id,
      user.id,
    )
    if (!passkey) {
      throw new Error('Passkey not found')
    }

    const verification = await verifyAuthenticationResponse({
      response: input.body,
      expectedChallenge: authenticationSession.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: passkey.publicKey,
        counter: Number(passkey.counter),
        transports: passkey.transports ?? undefined,
      },
    })

    const { verified } = verification
    if (verified) {
      // biome-ignore lint/style/noNonNullAssertion:
      const { newCounter } = verification.authenticationInfo!
      passkey.counter = BigInt(newCounter)
      await this.passkeyRepo.save(passkey)
    }

    return { verified }
  }
}
