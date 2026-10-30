import type { JsonValue, LogStatus, ServiceId } from '../types/api'

/** Polling interval of the dashboard, in milliseconds. */
export const POLL_INTERVAL_MS = 3000

/** A service is flagged as having problems when its error rate (%) is above this value. */
export const ERROR_RATE_THRESHOLD = 15

export const CHART_POINTS = 20

export const LOGS_PAGE_SIZE = 10

export interface ServiceDefinition {
  id: ServiceId
  label: string
  description: string
  /** CSS variable holding the series color. */
  color: string
}

export const SERVICES: readonly ServiceDefinition[] = [
  { id: 'inventory', label: 'Inventario', description: 'Catálogo y existencias', color: 'var(--series-inventory)' },
  { id: 'orders', label: 'Pedidos', description: 'Creación y seguimiento', color: 'var(--series-orders)' },
  { id: 'payments', label: 'Pagos', description: 'Cobros y reembolsos', color: 'var(--series-payments)' },
]

export const SERVICE_LABEL: Record<ServiceId, string> = {
  inventory: 'Inventario',
  orders: 'Pedidos',
  payments: 'Pagos',
}

export const STATUS_LABEL: Record<LogStatus, string> = {
  SUCCESS: 'Exitoso',
  ERROR: 'Error',
}

export interface OperationPreset {
  operation: string
  body: Record<string, JsonValue>
}

/** Sample requests for the "Probar servicio" panel. */
export const OPERATION_PRESETS: Record<ServiceId, OperationPreset[]> = {
  inventory: [
    { operation: 'listProducts', body: {} },
    { operation: 'checkStock', body: { sku: 'SKU-1001', quantity: 2 } },
    { operation: 'addStock', body: { sku: 'SKU-1002', quantity: 10 } },
    { operation: 'removeStock', body: { sku: 'SKU-1002', quantity: 1 } },
  ],
  orders: [
    { operation: 'createOrder', body: { customerId: 'CUST-100', items: [{ sku: 'SKU-1002', quantity: 1 }] } },
    { operation: 'getOrder', body: { orderId: 'ORD-1001' } },
    { operation: 'listOrders', body: {} },
    { operation: 'cancelOrder', body: { orderId: 'ORD-1001' } },
  ],
  payments: [
    { operation: 'processPayment', body: { orderId: 'ORD-1001', amount: 89000, method: 'CARD' } },
    { operation: 'getPaymentStatus', body: { paymentId: 'PAY-5001' } },
    { operation: 'refundPayment', body: { paymentId: 'PAY-5001' } },
  ],
}
