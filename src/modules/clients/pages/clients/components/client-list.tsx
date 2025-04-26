import { useState } from 'react'
import { useClients } from '@/modules/clients/hooks/useClients'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { ClientForm } from './client-form'


export const ClientList = () => {
  const { clients, isLoading, deleteClient } = useClients()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    setSelectedClient(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      await deleteClient(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <DataTable
        columns={columns(handleEdit, handleDelete)}
        data={clients?.data || []}
        isLoading={isLoading}
      />

      <ClientForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedClient(null)
        }}
        clientId={selectedClient}
      />
    </div>
  )
}
