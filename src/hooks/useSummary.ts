import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchSummary } from '../api/metrics'
import { POLL_INTERVAL_MS } from '../lib/constants'

export function useSummary() {
  return useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
    refetchInterval: POLL_INTERVAL_MS,
    placeholderData: keepPreviousData,
  })
}
