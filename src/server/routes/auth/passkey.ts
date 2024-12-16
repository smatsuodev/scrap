import type { User } from '@/common/model/user'
import {
  PASSKEY_AUTHENTICATION_CHALLENGE_COOKIE_NAME,
  PASSKEY_AUTHENTICATION_CHALLENGE_TTL,
  PASSKEY_REGISTRATION_SESSION_TTL,
} from '@/server/constant/passkey'
import { SESSION_COOKIE_NAME, SESSION_TTL } from '@/server/constant/session'
import type { AppEnv } from '@/server/env'
import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { PasskeyRepository } from '@/server/repository/passkey'
import { KVPasskeyRegistrationSessionRepository } from '@/server/repository/passkey/registrationSession'
import { UserRepository } from '@/server/repository/user'
import {
  type IPasskeyAuthenticationService,
  PasskeyAuthenticationService,
} from '@/server/service/passkey/authentication'
import {
  type IPasskeyRegistrationService,
  PasskeyRegistrationService,
} from '@/server/service/passkey/registration'
import { honoFactory } from '@/server/utility/factory'
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { validator } from 'hono/validator'

type AppEnvWithDeps = AppEnv & {
  Variables: {
    passkeyRegistrationService: IPasskeyRegistrationService
    passkeyAuthenticationService: IPasskeyAuthenticationService
  }
}

const injectDeps = createMiddleware<AppEnvWithDeps>(async (c, next) => {
  const userRepo = new UserRepository(c.var.db)
  const passkeyRepo = new PasskeyRepository(c.var.db)
  const regSessionRepo = new KVPasskeyRegistrationSessionRepository(
    c.env.SESSION_KV,
    PASSKEY_REGISTRATION_SESSION_TTL,
  )

  const regService = new PasskeyRegistrationService(
    userRepo,
    passkeyRepo,
    regSessionRepo,
  )
  const authService = new PasskeyAuthenticationService(passkeyRepo)

  c.set('passkeyRegistrationService', regService)
  c.set('passkeyAuthenticationService', authService)

  await next()
})

const passkeyAuth = honoFactory
  .createApp()
  .use(injectDeps)
  .get('/attestation/options', sessionAuthMiddleware, async (c) => {
    const session = c.var.session

    const options = await c.var.passkeyRegistrationService.generateOptions({
      userId: session.userId,
    })
    return c.json(options)
  })
  .post(
    '/attestation',
    sessionAuthMiddleware,
    // body が必要なことだけ明示する
    validator('json', (value) => value),
    async (c) => {
      const session = c.var.session
      const body = await c.req.json<RegistrationResponseJSON>()

      let verified: boolean
      try {
        const verificationJSON = await c.var.passkeyRegistrationService.verify({
          userId: session.userId,
          registrationResponse: body,
        })
        verified = verificationJSON.verified
      } catch (e) {
        console.error(e)
        throw new HTTPException(400)
      }

      if (!verified) {
        throw new HTTPException(400)
      }

      return c.json({ verified }, 201)
    },
  )
  .get('/assertion/options', async (c) => {
    const options = await c.var.passkeyAuthenticationService.generateOptions({})

    setCookie(
      c,
      PASSKEY_AUTHENTICATION_CHALLENGE_COOKIE_NAME,
      options.challenge,
      {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'strict',
        maxAge: PASSKEY_AUTHENTICATION_CHALLENGE_TTL,
      },
    )

    return c.json(options)
  })
  .post(
    '/assertion',
    // body が必要なことだけ明示する
    validator('json', (value) => value),
    async (c) => {
      const expectedChallenge = getCookie(
        c,
        PASSKEY_AUTHENTICATION_CHALLENGE_COOKIE_NAME,
      )
      if (!expectedChallenge) {
        throw new HTTPException(400)
      }
      const body = await c.req.json<AuthenticationResponseJSON>()

      let verified: boolean
      let user: User
      try {
        const result = await c.var.passkeyAuthenticationService.verify({
          authenticationResponse: body,
          expectedChallenge,
        })
        verified = result.verified
        user = result.user
      } catch (e) {
        console.error(e)
        throw new HTTPException(400)
      }

      if (!verified) {
        throw new HTTPException(400)
      }

      const session = await c.var.sessionRepository.createSession(user.id)
      setCookie(c, SESSION_COOKIE_NAME, session.id, {
        httpOnly: true,
        sameSite: 'strict',
        secure: import.meta.env.PROD,
        maxAge: SESSION_TTL,
      })

      return c.json({ verified }, 200)
    },
  )

export default passkeyAuth
