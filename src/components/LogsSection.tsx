import { useState } from 'react'
import { EMPTY_FILTERS, hasActiveFilters, useLogs, type LogFilters as Filters } from '../hooks/useLogs'
import { LOGS_PAGE_SIZE } from '../lib/constants'
import { LogFilters } from './LogFilters'
import { LogsTable } from './LogsTable'
import { Pagination } from './Pagination'

/** Filters and page live here so they survive the 3-second polling untouched. */
export function LogsSection() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [page, setPage] = useState(0)
  const { data, isPending } = useLogs(filters, page)

  function changeFilters(next: Filters) {
    setFilters(next)
    setPage(0)
  }

  return (
    <section aria-labelledby="logs-heading" className="rounded-lg border border-line bg-surface p-6 shadow-card">
      <div className="mb-5">
        <h2 id="logs-heading" className="text-lg font-semibold">
          Logs en tiempo real
        </h2>
        <p className="text-sm text-muted">
          Cada llamada pasa por el Proxy de logging. Haz clic en una fila para ver su detalle.
        </p>
      </div>

      <LogFilters filters={filters} onChange={changeFilters} />

      <div className="mt-5 space-y-4">
        <LogsTable
          data={data}
          isLoading={isPending}
          isFiltered={hasActiveFilters(filters)}
        />
        {data && data.totalElements > 0 && (
          <Pagination
            page={data.page}
            size={LOGS_PAGE_SIZE}
            totalElements={data.totalElements}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </section>
  )
}
