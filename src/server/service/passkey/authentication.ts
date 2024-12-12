import type { IPasskeyRepository } from '@/server/repository/passkey'
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

export type GenerateOptionsInput = Record<string, unknown>
export type VerifyInput = {
  authenticationResponse: AuthenticationResponseJSON
  expectedChallenge: string
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
  constructor(private passkeyRepo: IPasskeyRepository) {}

  async generateOptions(
    _input: GenerateOptionsInput,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    return await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      allowCredentials: [],
    })
  }

  async verify(
    input: VerifyInput,
  ): Promise<Pick<VerifiedAuthenticationResponse, 'verified'>> {
    const passkey = await this.passkeyRepo.find(input.authenticationResponse.id)
    if (!passkey) {
      throw new Error('Passkey not found')
    }

    const verification = await verifyAuthenticationResponse({
      response: input.authenticationResponse,
      expectedChallenge: input.expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: passkey.publicKey,
        counter: Number(passkey.counter),
        transports: passkey.transports ?? undefined,
      },
      requireUserVerification: false,
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
