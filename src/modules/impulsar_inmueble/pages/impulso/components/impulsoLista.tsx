import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  type SortingState,
  type ColumnFiltersState
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import {PlusCircleIcon, Loader2, CalendarIcon } from 'lucide-react'

import { useGetAllImpulsos } from '@/modules/impulsar_inmueble/hooks/useImpulsar_State'
import { ImpulsarState } from '@/modules/impulsar_inmueble/models/impulso_state.model'
import { PrivateRoutes } from '@/models/routes.model'
import { EstadoBadgeImpulso } from './estadoBadgeImpulso'
import { ActionsCell } from './ActionsCell'
import Loading from '@/components/shared/loading'

export default function ImpulsarInmueblePage() {
  const navigate = useNavigate()
  const {
    allImpulsos,
    isLoading,
    isValidating,
    mutate,
  } = useGetAllImpulsos()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 })
  const columns = React.useMemo<ColumnDef<ImpulsarState>[]>(() => [
    {
     accessorKey: 'razonAImpulsar',
     header: 'Razón',
     cell: ({ row }) => {
     const razon = row.getValue<string>('razonAImpulsar') ?? '-';
      return (
       <div className="max-w-[150px] truncate" title={razon}>
         {razon}
       </div>
      );
     }
    },
    {
  accessorKey: 'startDate',
  header: 'Inicio',
  cell: ({ row }) => {
    const rawDate = row.getValue('startDate') as string;
     return new Date(rawDate).toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
     });
    },
    filterFn: (row, columnId, filterValue) => {
     const value = new Date(row.getValue(columnId)).toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
      });
      return value.includes(filterValue);
     }
    },
    {
      accessorKey: 'endDate',
      header: 'Fin',
      cell: ({ row }) => new Date(row.getValue('endDate')).toLocaleString('es-BO', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
      })
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <EstadoBadgeImpulso estado={row.getValue('status')} />
    },
    {
      accessorKey: 'user.name',
      header: 'Usuario',
      cell: ({ row }) => row.original.user?.name ?? '-'
    },
    {
      accessorKey: 'state.descripcion',
      header: 'Inmueble',
       cell: ({ row }) => {
        const descripcion = row.original.state?.descripcion ?? '-'
        return (
         <div className="max-w-[100px] truncate" title={descripcion}>
          {descripcion}
         </div>
        )
      }
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => <ActionsCell row={row} onRefresh={mutate} />
    }
  ], [mutate])

  const table = useReactTable({
    data: allImpulsos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, pagination }
  })

  if (isLoading) return <Loading />

return (
  <div className="w-full px-2 sm:px-4">
    <CardHeader className="p-0 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-center sm:text-left gap-2">
      <div>
        <CardTitle className="text-xl sm:text-2xl">Impulsos</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Listado de inmuebles impulsados
        </CardDescription>
      </div>
      {isValidating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="animate-spin h-4 w-4" />
          Actualizando...
        </div>
      )}
    </CardHeader>

    {/* Filtro y botón */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 py-4 justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Input
          type="text"
          placeholder="Buscar por fecha de inicio..."
          value={(table.getColumn('startDate')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('startDate')?.setFilterValue(event.target.value)
          }
          className="pl-10 pr-4"
        />
        <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <Button
        size="sm"
        className="h-9 sm:h-8 w-full sm:w-auto gap-1"
        onClick={() => navigate(PrivateRoutes.IMPULSO_CREATE)}
      >
        <PlusCircleIcon className="h-4 w-4" />
        <span>Nuevo impulso</span>
      </Button>
    </div>

    {/* Tabla con scroll horizontal */}
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[1000px]">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center h-24">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {/* Paginación */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4 text-center sm:text-left">
      <div className="text-sm text-muted-foreground">
        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  </div>
)
}