import clsx from 'clsx'
import { CheckCircle2, XCircle } from 'lucide-react'
import { STATUS_LABEL } from '../lib/constants'
import type { LogStatus } from '../types/api'

export function StatusBadge({ status }: { status: LogStatus }) {
  const ok = status === 'SUCCESS'
  const Icon = ok ? CheckCircle2 : XCircle
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        ok ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  )
}
