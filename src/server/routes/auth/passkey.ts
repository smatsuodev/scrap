import { PASSKEY_REGISTRATION_SESSION_TTL } from '@/server/constant/passkey'
import type { AppEnv } from '@/server/env'
import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { PasskeyRepository } from '@/server/repository/passkey'
import { KVPasskeyRegistrationSessionRepository } from '@/server/repository/passkey/registrationSession'
import { UserRepository } from '@/server/repository/user'
import {
  type VerifyInput as AuthenticationVerifyInput,
  type IPasskeyAuthenticationService,
  PasskeyAuthenticationService,
} from '@/server/service/passkey/authentication'
import {
  type IPasskeyRegistrationService,
  PasskeyRegistrationService,
  type VerifyInput as RegistrationVerifyInput,
} from '@/server/service/passkey/registration'
import { honoFactory } from '@/server/utility/factory'
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

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
  .post('/attestation', sessionAuthMiddleware, async (c) => {
    const session = c.var.session
    const body =
      await c.req.json<RegistrationVerifyInput['registrationResponse']>()

    const { verified } = await c.var.passkeyRegistrationService.verify({
      userId: session.userId,
      registrationResponse: body,
    })
    if (!verified) {
      throw new HTTPException(400)
    }

    return c.json(null, 201)
  })
  .get('/assertion/options', async (c) => {
    const options = await c.var.passkeyAuthenticationService.generateOptions({})

    setCookie(c, 'ASSERTION_EXPECTED_CHALLENGE', options.challenge, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
    })

    return c.json(options)
  })
  .post('/assertion', async (c) => {
    const expectedChallenge = getCookie(c, 'ASSERTION_EXPECTED_CHALLENGE')
    if (!expectedChallenge) {
      throw new HTTPException(400)
    }
    const body =
      await c.req.json<AuthenticationVerifyInput['authenticationResponse']>()

    const { verified } = await c.var.passkeyAuthenticationService.verify({
      authenticationResponse: body,
      expectedChallenge,
    })
    if (!verified) {
      throw new HTTPException(400)
    }

    return c.json(null, 201)
  })

export default passkeyAuth
