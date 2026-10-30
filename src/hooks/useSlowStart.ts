import { useEffect, useState } from 'react'

/** True when `pending` has lasted longer than `delayMs` (e.g. a backend waking up from idle). */
export function useSlowStart(pending: boolean, delayMs: number): boolean {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!pending) {
      const reset = window.setTimeout(() => setSlow(false), 0)
      return () => window.clearTimeout(reset)
    }
    const timer = window.setTimeout(() => setSlow(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [pending, delayMs])

  return slow
}
