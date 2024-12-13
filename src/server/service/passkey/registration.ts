import type { UserId } from '@/common/model/user'
import type { Passkey } from '@/server/model/passkey'
import type { IPasskeyRepository } from '@/server/repository/passkey'
import type { IPasskeyRegistrationSessionRepository } from '@/server/repository/passkey/registrationSession'
import type { IUserRepository } from '@/server/repository/user'
import { origin, rpID, rpName } from '@/server/service/passkey/rp'
import {
  type VerifiedRegistrationResponse,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'

export type GenerateOptionsInput = {
  userId: UserId
}

export type VerifyInput = {
  userId: UserId
  registrationResponse: RegistrationResponseJSON
}

export interface IPasskeyRegistrationService {
  generateOptions(
    input: GenerateOptionsInput,
  ): Promise<PublicKeyCredentialCreationOptionsJSON>
  verify(
    input: VerifyInput,
  ): Promise<Pick<VerifiedRegistrationResponse, 'verified'>>
}

export class PasskeyRegistrationService implements IPasskeyRegistrationService {
  constructor(
    private userRepo: IUserRepository,
    private passkeyRepo: IPasskeyRepository,
    private passkeyRegistrationSessionRepo: IPasskeyRegistrationSessionRepository,
  ) {}

  // refs: https://simplewebauthn.dev/docs/packages/server#1-generate-registration-options
  async generateOptions(input: GenerateOptionsInput) {
    const user = await this.userRepo.find(input.userId)
    if (!user) {
      throw new Error('User not found')
    }
    const userPasskeys = await this.passkeyRepo.findByUserId(user.id)

    const options: PublicKeyCredentialCreationOptionsJSON =
      await generateRegistrationOptions({
        rpName,
        rpID,
        userName: user.id,
        // Don't prompt users for additional information about the authenticator
        attestationType: 'none',
        excludeCredentials: userPasskeys.map((passkey) => ({
          id: passkey.id,
          ...(passkey.transports && { transports: passkey.transports }),
        })),
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'preferred',
          authenticatorAttachment: 'platform',
        },
      })

    await this.passkeyRegistrationSessionRepo.store(user.id, {
      challenge: options.challenge,
      webauthnUserId: options.user.id,
    })

    return options
  }

  // refs: https://simplewebauthn.dev/docs/packages/server#2-verify-registration-response
  async verify(input: VerifyInput) {
    const user = await this.userRepo.find(input.userId)
    if (!user) {
      throw new Error('User not found')
    }
    const registrationSession = await this.passkeyRegistrationSessionRepo.load(
      user.id,
    )
    if (!registrationSession) {
      throw new Error('Registration session not found')
    }

    const verification = await verifyRegistrationResponse({
      response: input.registrationResponse,
      expectedChallenge: registrationSession.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    })

    const { verified } = verification
    if (verified) {
      const { credential, credentialDeviceType, credentialBackedUp } =
        // biome-ignore lint/style/noNonNullAssertion:
        verification.registrationInfo!

      const newPasskey: Passkey = {
        id: credential.id,
        publicKey: credential.publicKey,
        user: user,
        webauthnUserId: registrationSession.webauthnUserId,
        counter: credential.counter,
        isBackedUp: credentialBackedUp,
        deviceType: credentialDeviceType,
        transports: credential.transports ?? null,
      }
      await this.passkeyRepo.save(newPasskey)
    }

    return { verified }
  }
}
