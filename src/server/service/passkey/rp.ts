export const rpName = 'Scrap'
export const origin =
  (import.meta.env.PROD && import.meta.env.CF_PAGES_URL) ||
  'http://localhost:5173'
export const rpId = createRpId(new URL(origin).hostname)

function createRpId(hostname: string): string {
  if (hostname.endsWith('pages.dev')) {
    // branch-name.project-name.pages.dev -> project-name.pages.dev
    return hostname.split('.').slice(1).join('.')
  }
  // それ以外 = 開発環境ではそのまま
  return hostname
}
