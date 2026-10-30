import { useIsFetching } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { Toaster } from 'sonner'
import { BackendBanner, type BannerMode } from './components/BackendBanner'
import { Header } from './components/Header'
import { LogsSection } from './components/LogsSection'
import { ResponseChart } from './components/ResponseChart'
import { ServiceCards } from './components/ServiceCards'
import { ServiceTester } from './components/ServiceTester'
import { useSlowStart } from './hooks/useSlowStart'
import { useSimulateLoad } from './hooks/useSimulateLoad'
import { useSummary } from './hooks/useSummary'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()
  const summary = useSummary()
  const simulate = useSimulateLoad()
  const fetching = useIsFetching() > 0
  const [testerOpen, setTesterOpen] = useState(false)
  const closeTester = useCallback(() => setTesterOpen(false), [])

  const offline = summary.isError
  const waking = useSlowStart(summary.isPending && !summary.isError, 5000)
  const bannerMode: BannerMode = offline ? 'offline' : waking ? 'waking' : null

  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Header
        theme={theme}
        onToggleTheme={toggle}
        onSimulate={() => simulate.mutate()}
        simulating={simulate.isPending}
        onOpenTester={() => setTesterOpen(true)}
        online={!offline}
        lastUpdate={summary.dataUpdatedAt}
        fetching={fetching}
      />

      <BackendBanner mode={bannerMode} retrying={summary.isFetching} onRetry={() => void summary.refetch()} />

      <main className="flex flex-col gap-6">
        <ServiceCards summary={summary.data} />
        <ResponseChart />
        <LogsSection />
      </main>

      <footer className="mt-auto pt-4 text-center text-xs text-muted">
        Taller de Patrones de Software: patrón Proxy aplicado a monitoreo de microservicios.
      </footer>

      <ServiceTester open={testerOpen} onClose={closeTester} />
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--fg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-md)',
          },
        }}
      />
    </div>
  )
}
