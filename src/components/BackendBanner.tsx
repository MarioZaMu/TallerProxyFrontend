import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, WifiOff } from 'lucide-react'
import { API_BASE_URL } from '../api/client'

interface Props {
  visible: boolean
  retrying: boolean
  onRetry: () => void
}

export function BackendBanner({ visible, retrying, onRetry }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ overflow: 'hidden' }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
