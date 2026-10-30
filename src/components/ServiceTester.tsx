import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Send, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { ApiError } from '../api/client'
import { invokeService } from '../api/services'
import { OPERATION_PRESETS, SERVICES } from '../lib/constants'
import type { JsonValue, ServiceId, ServiceResponse } from '../types/api'
import { JsonViewer } from './JsonViewer'

interface Props {
  open: boolean
  onClose: () => void
}

const fieldClass =
  'h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-fg transition focus:border-accent'

function isJsonObject(value: JsonValue): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Side panel to fire a single operation by hand and watch it appear in the logs. */
export function ServiceTester({ open, onClose }: Props) {
  const queryClient = useQueryClient()
  const [serviceId, setServiceId] = useState<ServiceId>('inventory')
  const [operation, setOperation] = useState(OPERATION_PRESETS.inventory[0].operation)
  const [body, setBody] = useState(JSON.stringify(OPERATION_PRESETS.inventory[0].body, null, 2))
  const [sending, setSending] = useState(false)
  const [response, setResponse] = useState<ServiceResponse | null>(null)
  const [error, setError] = useState<{ message: string; requestId: string | null } | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function selectPreset(nextService: ServiceId, nextOperation: string) {
    const preset = OPERATION_PRESETS[nextService].find((p) => p.operation === nextOperation)
    setServiceId(nextService)
    setOperation(nextOperation)
    setBody(JSON.stringify(preset?.body ?? {}, null, 2))
    setResponse(null)
    setError(null)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    let parsed: JsonValue
    try {
      parsed = JSON.parse(body || '{}') as JsonValue
    } catch {
      setError({ message: 'El cuerpo no es un JSON válido.', requestId: null })
      setResponse(null)
      return
    }
    if (!isJsonObject(parsed)) {
      setError({ message: 'El cuerpo debe ser un objeto JSON.', requestId: null })
      setResponse(null)
      return
    }

    setSending(true)
    setError(null)
    try {
      const result = await invokeService(serviceId, operation, parsed)
      setResponse(result)
      toast.success('Llamada exitosa', { description: `${serviceId}/${operation}` })
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null
      setResponse(null)
      setError({ message: apiError?.message ?? 'Error inesperado', requestId: apiError?.requestId ?? null })
      toast.error('La llamada falló', { description: apiError?.message })
    } finally {
      setSending(false)
      // The call was audited by the proxy: show it immediately.
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
      void queryClient.invalidateQueries({ queryKey: ['logs'] })
      void queryClient.invalidateQueries({ queryKey: ['chart'] })
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="tester-heading"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-line bg-surface p-6 shadow-pop"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 id="tester-heading" className="text-lg font-semibold">
                  Probar servicio
                </h2>
                <p className="text-sm text-muted">Dispara una operación y mírala aparecer en los logs al instante.</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Cerrar panel"
                className="grid size-9 place-items-center rounded-md border border-line transition hover:bg-surface-2 active:scale-95"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                Servicio
                <select
                  className={fieldClass}
                  value={serviceId}
                  onChange={(event) => {
                    const next = event.target.value as ServiceId
                    selectPreset(next, OPERATION_PRESETS[next][0].operation)
                  }}
                >
                  {SERVICES.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                Operación
                <select
                  className={`${fieldClass} font-mono`}
                  value={operation}
                  onChange={(event) => selectPreset(serviceId, event.target.value)}
                >
                  {OPERATION_PRESETS[serviceId].map((preset) => (
                    <option key={preset.operation} value={preset.operation}>
                      {preset.operation}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
                Cuerpo de la petición (JSON)
                <textarea
                  rows={8}
                  spellCheck={false}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="w-full rounded-md border border-line bg-surface p-3 font-mono text-xs text-fg transition focus:border-accent"
                />
              </label>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
              >
                {sending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
                {sending ? 'Enviando...' : 'Enviar llamada'}
              </button>
            </form>

            <div className="mt-6" aria-live="polite">
              {error && (
                <div role="alert" className="rounded-md border border-danger bg-danger-soft p-3 text-sm">
                  <p className="font-semibold text-danger">Error</p>
                  <p>{error.message}</p>
                  {error.requestId && (
                    <p className="mt-1 break-all font-mono text-xs text-muted">requestId: {error.requestId}</p>
                  )}
                </div>
              )}
              {response && (
                <div>
                  <p className="mb-2 break-all font-mono text-xs text-muted">requestId: {response.requestId}</p>
                  <JsonViewer value={response.result} label="resultado de la llamada" />
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
