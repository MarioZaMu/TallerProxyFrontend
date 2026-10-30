import type { LogEntry, LogQuery, MetricsSummary, PageResponse, SimulationResult } from '../types/api'
import { request } from './client'

export function fetchSummary(): Promise<MetricsSummary> {
  return request<MetricsSummary>('/api/metrics/summary')
}

export function fetchLogs(query: LogQuery): Promise<PageResponse<LogEntry>> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  }
  return request<PageResponse<LogEntry>>(`/api/metrics/logs?${params.toString()}`)
}

export function simulateLoad(): Promise<SimulationResult> {
  return request<SimulationResult>('/api/metrics/simulate-load', { method: 'POST' })
}
