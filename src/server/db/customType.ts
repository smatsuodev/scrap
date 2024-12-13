import { customType } from 'drizzle-orm/sqlite-core'

export const uint8ArrayAsBase64 = customType<{
  data: Uint8Array
  driverData: string
}>({
  dataType: () => 'text',
  toDriver: (value) => btoa(String.fromCharCode(...value)),
  fromDriver: (value) => Uint8Array.from(Buffer.from(value, 'base64')),
})
