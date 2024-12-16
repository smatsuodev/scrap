import { hcWithType } from '@/server/client'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'
import { useCallback, useMemo } from 'react'

export default function usePasskey() {
  const client = useMemo(() => hcWithType('/api'), [])

  // refs: https://simplewebauthn.dev/docs/packages/browser#startregistration
  const registerPasskey = useCallback(async () => {
    const attestationRes = await client.auth.passkey.attestation.options.$get()
    if (!attestationRes.ok) {
      throw new Error('Failed to get attestation options')
    }
    const optionsJSON = await attestationRes.json()

    let registrationResponse: RegistrationResponseJSON
    try {
      registrationResponse = await startRegistration({
        optionsJSON,
        useAutoRegister: true,
      })
    } catch (e) {
      throw new Error('Failed to start registration')
    }

    const verificationRes = await client.auth.passkey.attestation.$post({
      json: registrationResponse,
    })
    if (!verificationRes.ok) {
      throw new Error('Failed to verify registration response')
    }
    const { verified } = await verificationRes.json()

    if (!verified) {
      throw new Error('Failed to verify registration response')
    }
  }, [client])

  // refs: https://simplewebauthn.dev/docs/packages/browser#startauthentication
  const loginWithPasskey = useCallback(
    async ({ useBrowserAutofill }: { useBrowserAutofill: boolean }) => {
      const assertionRes = await client.auth.passkey.assertion.options.$get()
      if (!assertionRes.ok) {
        throw new Error('Failed to get assertion options')
      }
      const optionsJSON = await assertionRes.json()

      let assertionResponse: AuthenticationResponseJSON
      try {
        assertionResponse = await startAuthentication({
          optionsJSON,
          useBrowserAutofill,
        })
      } catch (e) {
        throw new Error('Failed to start authentication')
      }

      const verificationRes = await client.auth.passkey.assertion.$post({
        json: assertionResponse,
      })
      if (!verificationRes.ok) {
        throw new Error('Failed to verify assertion response')
      }
      const { verified } = await verificationRes.json()

      if (!verified) {
        throw new Error('Failed to verify assertion response')
      }
    },
    [client],
  )

  return {
    registerPasskey,
    loginWithPasskey,
  }
}
