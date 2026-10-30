import { LineChart as LineChartIcon } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useChartData, type ChartPoint, type ChartRow } from '../hooks/useChartData'
import { CHART_POINTS, SERVICES, STATUS_LABEL, type ServiceDefinition } from '../lib/constants'
import { formatDuration } from '../lib/format'
import { Skeleton } from './Skeleton'

interface DotProps {
  cx?: number
  cy?: number
  payload?: ChartRow
}

function makeDot(service: ServiceDefinition) {
  return function ServiceDot({ cx, cy, payload }: DotProps) {
    const point = payload?.[service.id]
    if (cx === undefined || cy === undefined || !point) return <g key={`${service.id}-${payload?.position}`} />
    const failed = point.status === 'ERROR'
    return (
      <circle
        key={`${service.id}-${payload?.position}`}
        cx={cx}
        cy={cy}
        r={failed ? 5 : 3}
        fill={failed ? 'var(--danger)' : service.color}
        stroke="var(--surface)"
        strokeWidth={2}
      />
    )
  }
}

interface TooltipEntry {
  payload?: ChartRow
}

interface TooltipProps {
  active?: boolean
  payload?: readonly TooltipEntry[]
}

function ChartTooltip({ active, payload }: TooltipProps) {
  const row = payload?.[0]?.payload
  if (!active || !row) return null
  return (
    <div className="min-w-52 rounded-md border border-line bg-surface p-3 text-xs shadow-pop">
      <p className="mb-2 font-semibold">Llamada #{row.position}</p>
      <ul className="space-y-1.5">
        {SERVICES.map((service) => {
          const point: ChartPoint | null = row[service.id]
          if (!point) return null
          return (
            <li key={service.id} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: service.color }} />
                {service.label}
              </span>
              <span className="text-right">
                <span className="tabular font-mono font-medium">{formatDuration(point.durationMs)}</span>
                <span className="block font-mono text-[11px] text-muted">
                  {point.operation} {point.status === 'ERROR' ? `(${STATUS_LABEL.ERROR})` : ''}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ResponseChart() {
  const { rows, hasData, isLoading } = useChartData()

  return (
    <section aria-labelledby="chart-heading" className="rounded-lg border border-line bg-surface p-6 shadow-card">
      <div className="mb-4">
        <h2 id="chart-heading" className="text-lg font-semibold">
          Tiempo de respuesta
        </h2>
        <p className="text-sm text-muted">
          Últimas {CHART_POINTS} llamadas por servicio. Los puntos rojos indican llamadas con error.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : !hasData ? (
        <div className="grid h-72 place-items-center text-center">
          <div>
            <LineChartIcon className="mx-auto size-8 text-muted" aria-hidden />
            <p className="mt-3 font-medium">Todavía no hay llamadas registradas</p>
            <p className="text-sm text-muted">Pulsa «Simular carga» para generar tráfico de ejemplo.</p>
          </div>
        </div>
      ) : (
        <div role="img" aria-label="Gráfica de líneas con el tiempo de respuesta de las últimas 20 llamadas por servicio" className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 4" vertical={false} />
              <XAxis
                dataKey="position"
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--line)' }}
                tickLine={false}
                label={{ value: 'Llamada (de la más antigua a la más reciente)', position: 'insideBottom', offset: -2, fill: 'var(--muted)', fontSize: 11 }}
                height={42}
              />
              <YAxis
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                unit=" ms"
                width={64}
              />
              <Tooltip content={ChartTooltip} cursor={{ stroke: 'var(--line)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {SERVICES.map((service) => (
                <Line
                  key={service.id}
                  name={service.label}
                  type="monotone"
                  dataKey={(row: ChartRow) => row[service.id]?.durationMs ?? null}
                  stroke={service.color}
                  strokeWidth={2.25}
                  dot={makeDot(service)}
                  activeDot={{ r: 6 }}
                  connectNulls
                  isAnimationActive
                  animationDuration={700}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
