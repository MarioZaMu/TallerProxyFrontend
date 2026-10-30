import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '../api/client'
import { simulateLoad } from '../api/metrics'

export function useSimulateLoad() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: simulateLoad,
    onSuccess: async (result) => {
      toast.success('Simulación completada', {
        description: `${result.totalCalls} llamadas generadas: ${result.successCalls} exitosas y ${result.errorCalls} con error.`,
      })
      // Refresh everything right away instead of waiting for the next poll.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
        queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.invalidateQueries({ queryKey: ['chart'] }),
      ])
    },
    onError: (error: Error) => {
      toast.error('No se pudo simular la carga', {
        description: error instanceof ApiError && error.isNetworkError ? 'El backend no responde.' : error.message,
      })
    },
  })
}
