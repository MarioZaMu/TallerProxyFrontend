/** API models: they mirror the backend contract exactly. */

export type ServiceId = 'inventory' | 'orders' | 'payments'

export type LogStatus = 'SUCCESS' | 'ERROR'

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export interface LogEntry {
  requestId: string
  serviceId: ServiceId
  operation: string
  durationMs: number
  status: LogStatus
  /** ISO-8601 UTC instant */
  timestamp: string
  params: JsonValue
  response: JsonValue | null
  errorType: string | null
  errorMessage: string | null
  stackTraceSummary: string | null
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/** Rates are percentages (0-100); the average is in milliseconds. */
export interface ServiceMetrics {
  serviceId: string
  totalCalls: number
  successCalls: number
  errorCalls: number
  errorRate: number
  successRate: number
  avgResponseTimeMs: number
}

export interface MetricsSummary {
  generatedAt: string
  services: ServiceMetrics[]
  global: ServiceMetrics
}

export interface SimulationResult {
  totalCalls: number
  successCalls: number
  errorCalls: number
  durationMs: number
  byService: Record<string, { total: number; success: number; error: number }>
}

export interface ServiceResponse {
  requestId: string
  serviceId: ServiceId
  operation: string
  result: JsonValue
}

export interface ApiErrorBody {
  timestamp: string
  status: number
  error: string
  message: string
  requestId: string | null
}

export interface LogQuery {
  service?: ServiceId
  status?: LogStatus
  /** ISO-8601 instant */
  from?: string
  /** ISO-8601 instant */
  to?: string
  page?: number
  size?: number
}
