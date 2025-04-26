import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService } from '../services/client.service'
import { IClient } from '../interfaces/client.interface'
import { QueryParams } from '@/models/query.model'
import { toast } from 'sonner'



export const useClients = (params?: QueryParams) => {
  const queryClient = useQueryClient()

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getAll(params)
  })

  const createMutation = useMutation({
    mutationFn: clientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente creado exitosamente')
    },
    onError: (error: any) => {
      toast.error('Error al crear el cliente')
      console.error(error)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IClient> }) =>
      clientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente actualizado exitosamente')
    },
    onError: (error: any) => {
      toast.error('Error al actualizar el cliente')
      console.error(error)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: clientService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente eliminado exitosamente')
    },
    onError: (error: any) => {
      toast.error('Error al eliminar el cliente')
      console.error(error)
    }
  })

  return {
    clients,
    isLoading,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate
  }
}
