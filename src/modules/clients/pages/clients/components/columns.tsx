import { ColumnDef } from '@tanstack/react-table'
import { IClient } from '../../../interfaces/client.interface'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

export const columns = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<IClient>[] => [
  {
    accessorKey: 'name',
    header: 'Nombre'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono'
  },
  {
    accessorKey: 'documentType',
    header: 'Tipo de Documento'
  },
  {
    accessorKey: 'documentNumber',
    header: 'Número de Documento'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const client = row.original

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(client.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(client.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
] 