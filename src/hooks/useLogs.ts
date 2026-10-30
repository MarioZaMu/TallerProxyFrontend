import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchLogs } from '../api/metrics'
import { LOGS_PAGE_SIZE, POLL_INTERVAL_MS } from '../lib/constants'
import { localInputToIso } from '../lib/format'
import type { LogStatus, ServiceId } from '../types/api'

export interface LogFilters {
  service: ServiceId | ''
  status: LogStatus | ''
  /** `datetime-local` value */
  from: string
  /** `datetime-local` value */
  to: string
}

export const EMPTY_FILTERS: LogFilters = { service: '', status: '', from: '', to: '' }

export function hasActiveFilters(filters: LogFilters): boolean {
  return Object.values(filters).some((value) => value !== '')
}

/** Server-side filtered and paginated logs, refreshed every 3 seconds without discarding the current rows. */
export function useLogs(filters: LogFilters, page: number) {
  return useQuery({
    queryKey: ['logs', filters, page],
    queryFn: () =>
      fetchLogs({
        service: filters.service || undefined,
        status: filters.status || undefined,
        from: localInputToIso(filters.from),
        to: localInputToIso(filters.to),
        page,
        size: LOGS_PAGE_SIZE,
      }),
    refetchInterval: POLL_INTERVAL_MS,
    placeholderData: keepPreviousData,
  })
}
