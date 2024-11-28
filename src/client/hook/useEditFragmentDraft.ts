import type { FragmentId } from '@/common/model/fragment'
import { useCallback, useMemo } from 'react'

export default function useEditFragmentDraft(fragmentId: FragmentId) {
  const localStorageKey = useMemo(
    () => `draft-fragment-${fragmentId}`,
    [fragmentId],
  )

  const getDraft = useCallback((): string | null => {
    return localStorage.getItem(localStorageKey)
  }, [localStorageKey])

  const saveDraft = useCallback(
    (content: string) => {
      localStorage.setItem(localStorageKey, content)
    },
    [localStorageKey],
  )

  const removeDraft = useCallback(() => {
    localStorage.removeItem(localStorageKey)
  }, [localStorageKey])

  return {
    getDraft,
    saveDraft,
    removeDraft,
  }
}
