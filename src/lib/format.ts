const LOCALE = 'es-CO'

export function numberFormatter(decimals = 0): Intl.NumberFormat {
  return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(LOCALE, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function formatTime(value: number | Date): string {
  return new Date(value).toLocaleTimeString(LOCALE, { hour12: false })
}

export function formatDuration(ms: number): string {
  return `${numberFormatter(0).format(ms)} ms`
}

export function shortId(id: string): string {
  return id.slice(0, 8)
}

/** Converts a `datetime-local` value (local time) into an ISO-8601 instant. */
export function localInputToIso(value: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}
