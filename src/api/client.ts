import type { ApiErrorBody } from '../types/api'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

export class ApiError extends Error {
  status: number
  requestId: string | null

  constructor(message: string, status: number, requestId: string | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.requestId = requestId
  }

  /** True when the server could not be reached at all. */
  get isNetworkError(): boolean {
    return this.status === 0
  }
}

function isErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && 'message' in value && 'status' in value
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init)
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0)
  }

  const text = await response.text()
  let body: unknown = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = null
    }
  }

  if (!response.ok) {
    if (isErrorBody(body)) {
      throw new ApiError(body.message, response.status, body.requestId)
    }
    throw new ApiError(`Error ${response.status} del servidor`, response.status)
  }
  return body as T
}
