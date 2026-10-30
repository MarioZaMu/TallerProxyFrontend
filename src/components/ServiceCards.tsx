import { SERVICES } from '../lib/constants'
import type { MetricsSummary } from '../types/api'
import { ServiceCard, ServiceCardSkeleton } from './ServiceCard'

export function ServiceCards({ summary }: { summary: MetricsSummary | undefined }) {
  return (
    <section aria-labelledby="services-heading">
      <h2 id="services-heading" className="sr-only">
        Estado de los servicios
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {summary
          ? SERVICES.map((definition, index) => (
              <ServiceCard
                key={definition.id}
                definition={definition}
                metrics={summary.services.find((service) => service.serviceId === definition.id)}
                index={index}
              />
            ))
          : SERVICES.map((definition) => <ServiceCardSkeleton key={definition.id} />)}
      </div>
    </section>
  )
}
