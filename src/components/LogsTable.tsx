import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, SearchX } from 'lucide-react'
import { Fragment, useState } from 'react'
import { SERVICE_LABEL } from '../lib/constants'
import { formatDateTime, formatDuration, shortId } from '../lib/format'
import type { LogEntry, PageResponse } from '../types/api'
import { JsonViewer } from './JsonViewer'
import { Skeleton } from './Skeleton'
import { StatusBadge } from './StatusBadge'

interface Props {
  data: PageResponse<LogEntry> | undefined
  isLoading: boolean
  isFiltered: boolean
}

const COLUMNS = 6

export function LogsTable({ data, isLoading, isFiltered }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const rows = data?.content ?? []

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Cargando logs">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="grid place-items-center rounded-md border border-dashed border-line px-6 py-14 text-center">
        <div>
          <SearchX className="mx-auto size-8 text-muted" aria-hidden />
          <p className="mt-3 font-medium">
            {isFiltered ? 'Ningún registro coincide con los filtros' : 'Aún no hay logs registrados'}
          </p>
          <p className="text-sm text-muted">
            {isFiltered
              ? 'Prueba con otros filtros o límpialos para ver todos los registros.'
              : 'Pulsa «Simular carga» o usa el panel «Probar servicio» para generar llamadas.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">Registro de llamadas a los microservicios. Se actualiza cada 3 segundos.</caption>
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Request ID</th>
            <th scope="col" className="px-4 py-3 font-medium">Servicio</th>
            <th scope="col" className="px-4 py-3 font-medium">Operación</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Duración</th>
            <th scope="col" className="px-4 py-3 font-medium">Estado</th>
            <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((log) => {
              const open = expandedId === log.requestId
              return (
                <Fragment key={log.requestId}>
                  <motion.tr
                    layout="position"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    onClick={() => setExpandedId(open ? null : log.requestId)}
                    className={clsx(
                      'cursor-pointer border-t border-line transition-colors hover:bg-surface-2',
                      open && 'bg-surface-2',
                    )}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`detail-${log.requestId}`}
                        aria-label={`${open ? 'Ocultar' : 'Ver'} detalle de ${log.requestId}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          setExpandedId(open ? null : log.requestId)
                        }}
                        className="inline-flex items-center gap-2 font-mono text-xs"
                      >
                        <ChevronRight
                          className={clsx('size-4 text-muted transition-transform', open && 'rotate-90')}
                          aria-hidden
                        />
                        <span title={log.requestId}>{shortId(log.requestId)}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">{SERVICE_LABEL[log.serviceId]}</td>
                    <td className="px-4 py-3 font-mono text-xs">{log.operation}</td>
                    <td className="tabular px-4 py-3 text-right font-mono text-xs">{formatDuration(log.durationMs)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="tabular whitespace-nowrap px-4 py-3 text-xs text-muted">
                      {formatDateTime(log.timestamp)}
                    </td>
                  </motion.tr>
                  <tr>
                    <td colSpan={COLUMNS} className="p-0">
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={`detail-${log.requestId}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <LogDetail log={log} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </Fragment>
              )
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

function LogDetail({ log }: { log: LogEntry }) {
  return (
    <div className="grid gap-5 border-t border-line bg-surface-2 p-4 lg:grid-cols-2">
      <div className="space-y-5 lg:col-span-2">
        <p className="break-all font-mono text-xs text-muted">
          Request ID completo: <span className="text-fg">{log.requestId}</span>
        </p>
      </div>
      <section>
        <h4 className="mb-2 text-sm font-semibold">Parámetros de entrada</h4>
        <JsonViewer value={log.params} label="parámetros de entrada" />
      </section>
      <section>
        <h4 className="mb-2 text-sm font-semibold">
          {log.status === 'ERROR' ? 'Detalle del error' : 'Respuesta completa'}
        </h4>
        {log.status === 'ERROR' ? (
          <div className="rounded-md border border-danger bg-danger-soft p-3">
            <p className="text-sm font-medium text-danger">
              {log.errorType}: {log.errorMessage}
            </p>
            {log.stackTraceSummary && (
              <>
                <h5 className="mb-1 mt-3 text-xs font-semibold text-muted">Stack trace resumido</h5>
                <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">{log.stackTraceSummary}</pre>
              </>
            )}
          </div>
        ) : (
          <JsonViewer value={log.response} label="respuesta" />
        )}
      </section>
    </div>
  )
}
