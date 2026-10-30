import { keepPreviousData, useQueries } from '@tanstack/react-query'
import { fetchLogs } from '../api/metrics'
import { CHART_POINTS, POLL_INTERVAL_MS, SERVICES } from '../lib/constants'
import type { LogEntry, LogStatus, ServiceId } from '../types/api'

export interface ChartPoint {
  durationMs: number
  operation: string
  status: LogStatus
  requestId: string
}

/** One row per call position (1 = oldest of the last 20); each service has its own point. */
export interface ChartRow {
  position: number
  inventory: ChartPoint | null
  orders: ChartPoint | null
  payments: ChartPoint | null
}

function toPoint(entry: LogEntry | undefined): ChartPoint | null {
  return entry
    ? { durationMs: entry.durationMs, operation: entry.operation, status: entry.status, requestId: entry.requestId }
    : null
}

/** Last 20 calls of every service (independent of the table filters). */
export function useChartData() {
  const queries = useQueries({
    queries: SERVICES.map((service) => ({
      queryKey: ['chart', service.id],
      queryFn: () => fetchLogs({ service: service.id, page: 0, size: CHART_POINTS }),
      refetchInterval: POLL_INTERVAL_MS,
      placeholderData: keepPreviousData,
    })),
  })

  const isLoading = queries.some((query) => query.data === undefined && query.isPending)
  const chronological = new Map<ServiceId, LogEntry[]>()
  SERVICES.forEach((service, index) => {
    // The API returns newest first; the chart reads oldest to newest.
    chronological.set(service.id, [...(queries[index].data?.content ?? [])].reverse())
  })

  const rows: ChartRow[] = Array.from({ length: CHART_POINTS }, (_, i) => ({
    position: i + 1,
    inventory: toPoint(chronological.get('inventory')?.[i]),
    orders: toPoint(chronological.get('orders')?.[i]),
    payments: toPoint(chronological.get('payments')?.[i]),
  }))
  const hasData = rows.some((row) => row.inventory || row.orders || row.payments)

  return { rows, hasData, isLoading }
}
