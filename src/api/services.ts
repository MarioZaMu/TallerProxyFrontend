import type { JsonValue, ServiceId, ServiceResponse } from '../types/api'
import { request } from './client'

export function invokeService(
  serviceId: ServiceId,
  operation: string,
  body: Record<string, JsonValue>,
): Promise<ServiceResponse> {
  return request<ServiceResponse>(`/api/services/${serviceId}/${encodeURIComponent(operation)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
