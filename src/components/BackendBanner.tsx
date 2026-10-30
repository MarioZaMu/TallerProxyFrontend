import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, RefreshCw, WifiOff } from 'lucide-react'
import { API_BASE_URL } from '../api/client'

export type BannerMode = 'offline' | 'waking' | null

interface Props {
  mode: BannerMode
  retrying: boolean
  onRetry: () => void
}

export function BackendBanner({ mode, retrying, onRetry }: Props) {
  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          key={mode}
          role={mode === 'offline' ? 'alert' : 'status'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ overflow: 'hidden' }}
        >
          {mode === 'waking' ? (
            <div className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4">
              <Loader2 className="mt-0.5 size-5 shrink-0 animate-spin text-accent" aria-hidden />
              <div>
                <p className="font-semibold">El servidor se está despertando</p>
                <p className="text-sm text-muted">
                  El backend gratuito entra en reposo cuando no se usa y puede tardar hasta un minuto en responder la
                  primera vez. Los datos aparecerán solos en cuanto esté listo.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger bg-danger-soft p-4">
              <div className="flex items-start gap-3">
                <WifiOff className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
                <div>
                  <p className="font-semibold text-danger">No se puede conectar con el backend</p>
                  <p className="text-sm">
                    Verifica que el servidor esté en ejecución en{' '}
                    <code className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-xs">{API_BASE_URL}</code>. Se
                    reintentará automáticamente cada 3 segundos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRetry}
                disabled={retrying}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-danger bg-surface px-3 text-sm font-medium transition hover:bg-surface-2 active:scale-[0.97] disabled:opacity-60"
              >
                <RefreshCw className={retrying ? 'size-4 animate-spin' : 'size-4'} aria-hidden />
                Reintentar ahora
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
