import { ChevronLeft, ChevronRight } from 'lucide-react'
import { numberFormatter } from '../lib/format'

interface Props {
  page: number
  size: number
  totalElements: number
  totalPages: number
  onPageChange: (page: number) => void
}

const buttonClass =
  'inline-flex h-9 items-center gap-1 rounded-md border border-line px-3 text-sm font-medium transition hover:bg-surface-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40'

export function Pagination({ page, size, totalElements, totalPages, onPageChange }: Props) {
  const format = numberFormatter(0)
  const first = totalElements === 0 ? 0 : page * size + 1
  const last = Math.min((page + 1) * size, totalElements)

  return (
    <nav aria-label="Paginación de logs" className="flex flex-wrap items-center justify-between gap-3">
      <p className="tabular text-sm text-muted">
        Mostrando {format.format(first)}-{format.format(last)} de {format.format(totalElements)} registros
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={buttonClass} disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </button>
        <span className="tabular min-w-24 text-center text-sm">
          Página {format.format(page + 1)} de {format.format(Math.max(totalPages, 1))}
        </span>
        <button
          type="button"
          className={buttonClass}
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  )
}
