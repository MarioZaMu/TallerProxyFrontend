import { FilterX } from 'lucide-react'
import { EMPTY_FILTERS, hasActiveFilters, type LogFilters as Filters } from '../hooks/useLogs'
import { SERVICES, STATUS_LABEL } from '../lib/constants'
import type { LogStatus, ServiceId } from '../types/api'

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

const fieldClass =
  'h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-fg transition focus:border-accent'

export function LogFilters({ filters, onChange }: Props) {
  const active = hasActiveFilters(filters)

  return (
    <form
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_1.2fr_auto]"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Filtros de logs"
    >
      <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
        Servicio
        <select
          className={fieldClass}
          value={filters.service}
          onChange={(event) => onChange({ ...filters, service: event.target.value as ServiceId | '' })}
        >
          <option value="">Todos</option>
          {SERVICES.map((service) => (
            <option key={service.id} value={service.id}>
              {service.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
        Estado
        <select
          className={fieldClass}
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as LogStatus | '' })}
        >
          <option value="">Todos</option>
          <option value="SUCCESS">{STATUS_LABEL.SUCCESS}</option>
          <option value="ERROR">{STATUS_LABEL.ERROR}</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
        Desde
        <input
          type="datetime-local"
          className={fieldClass}
          value={filters.from}
          max={filters.to || undefined}
          onChange={(event) => onChange({ ...filters, from: event.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-medium text-muted">
        Hasta
        <input
          type="datetime-local"
          className={fieldClass}
          value={filters.to}
          min={filters.from || undefined}
          onChange={(event) => onChange({ ...filters, to: event.target.value })}
        />
      </label>

      <div className="flex items-end">
        <button
          type="button"
          disabled={!active}
          onClick={() => onChange(EMPTY_FILTERS)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-medium transition hover:bg-surface-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <FilterX className="size-4" aria-hidden />
          Limpiar filtros
        </button>
      </div>
    </form>
  )
}
