import { Activity, FlaskConical, Loader2, Moon, Play, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'
import { POLL_INTERVAL_MS } from '../lib/constants'
import { formatTime } from '../lib/format'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  onSimulate: () => void
  simulating: boolean
  onOpenTester: () => void
  online: boolean
  lastUpdate: number
  fetching: boolean
}

export function Header({
  theme,
  onToggleTheme,
  onSimulate,
  simulating,
  onOpenTester,
  online,
  lastUpdate,
  fetching,
}: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-md bg-accent text-accent-fg">
          <Activity className="size-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Monitor de Microservicios</h1>
          <p className="text-sm text-muted">Proxy de auditoría y logging sobre Inventario, Pedidos y Pagos</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs"
          title={`Actualización automática cada ${POLL_INTERVAL_MS / 1000} segundos`}
          role="status"
          aria-live="polite"
        >
          <span className="live-dot" data-state={online ? 'online' : 'offline'} aria-hidden />
          <span className="font-semibold">{online ? 'En vivo' : 'Sin conexión'}</span>
          <span className="tabular text-muted">
            {lastUpdate > 0 ? `Actualizado ${formatTime(lastUpdate)}` : 'Esperando datos'}
          </span>
          {fetching && online && <Loader2 className="size-3 animate-spin text-muted" aria-hidden />}
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          className="grid size-10 place-items-center rounded-md border border-line bg-surface transition hover:bg-surface-2 active:scale-95"
        >
          {theme === 'dark' ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
        </button>

        <button
          type="button"
          onClick={onOpenTester}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-medium transition hover:bg-surface-2 active:scale-[0.98]"
        >
          <FlaskConical className="size-4" aria-hidden />
          Probar servicio
        </button>

        <motion.button
          type="button"
          onClick={onSimulate}
          disabled={simulating}
          whileTap={{ scale: 0.97 }}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-fg shadow-card transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
        >
          {simulating ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Play className="size-4" aria-hidden />}
          {simulating ? 'Simulando...' : 'Simular carga'}
        </motion.button>
      </div>
    </header>
  )
}
