import clsx from 'clsx'
import { AlertTriangle, CheckCircle2, CircleDashed, CreditCard, Package, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { ERROR_RATE_THRESHOLD, type ServiceDefinition } from '../lib/constants'
import type { ServiceMetrics } from '../types/api'
import { AnimatedNumber } from './AnimatedNumber'
import { Skeleton } from './Skeleton'

const ICONS: Record<ServiceDefinition['id'], ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  inventory: Package,
  orders: ShoppingCart,
  payments: CreditCard,
}

interface Props {
  definition: ServiceDefinition
  metrics: ServiceMetrics | undefined
  index: number
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-surface p-6 shadow-card" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10" />
        <Skeleton className="h-5 w-28" />
      </div>
      <Skeleton className="mt-8 h-10 w-24" />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  )
}

export function ServiceCard({ definition, metrics, index }: Props) {
  const Icon = ICONS[definition.id]
  const hasCalls = (metrics?.totalCalls ?? 0) > 0
  const hasProblems = hasCalls && (metrics?.errorRate ?? 0) > ERROR_RATE_THRESHOLD

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      aria-label={`Servicio de ${definition.label}`}
      data-problem={hasProblems}
      className={clsx(
        'relative rounded-lg border bg-surface p-6 shadow-card transition-colors',
        hasProblems ? 'alert-pulse border-danger bg-danger-soft' : 'border-line',
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid size-10 place-items-center rounded-md bg-surface-2"
            style={{ color: definition.color }}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight">{definition.label}</h3>
            <p className="text-xs text-muted">{definition.description}</p>
          </div>
        </div>
        <HealthBadge hasCalls={hasCalls} hasProblems={hasProblems} />
      </header>

      <div className="mt-7">
        <p className="text-xs font-medium text-muted">Total de llamadas</p>
        <p className="tabular text-4xl font-semibold tracking-tight">
          <AnimatedNumber value={metrics?.totalCalls ?? 0} />
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs font-medium text-muted">Tasa de éxito</dt>
          <dd className="tabular mt-1 font-mono text-xl font-medium">
            {hasCalls ? <AnimatedNumber value={metrics?.successRate ?? 0} decimals={1} suffix="%" /> : '-'}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Tiempo promedio</dt>
          <dd className="tabular mt-1 font-mono text-xl font-medium">
            {hasCalls ? <AnimatedNumber value={metrics?.avgResponseTimeMs ?? 0} decimals={0} suffix=" ms" /> : '-'}
          </dd>
        </div>
      </dl>

      {hasCalls && (
        <p className={clsx('mt-5 text-xs', hasProblems ? 'font-medium text-danger' : 'text-muted')}>
          Tasa de error: <span className="tabular font-mono">{metrics?.errorRate.toFixed(1)}%</span>
          {hasProblems && ` (supera el ${ERROR_RATE_THRESHOLD}%)`}
        </p>
      )}
    </motion.article>
  )
}

function HealthBadge({ hasCalls, hasProblems }: { hasCalls: boolean; hasProblems: boolean }) {
  if (hasProblems) {
    return (
      <span
        role="status"
        className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-xs font-semibold text-white"
      >
        <AlertTriangle className="size-3.5" aria-hidden />
        Servicio con problemas
      </span>
    )
  }
  if (!hasCalls) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
        <CircleDashed className="size-3.5" aria-hidden />
        Sin datos
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
      <CheckCircle2 className="size-3.5" aria-hidden />
      Saludable
    </span>
  )
}
