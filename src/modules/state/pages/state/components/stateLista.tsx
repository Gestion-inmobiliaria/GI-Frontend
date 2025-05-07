import * as React from 'react'
import {
  type ColumnFiltersState, type SortingState, type VisibilityState, type ColumnDef,
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable
} from '@tanstack/react-table'
import { MoreHorizontal, Search, PlusCircleIcon, Trash, Pencil, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { PrivateRoutes } from '@/models/routes.model'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useDeleteState, useGetAllState } from '@/modules/state/hooks/useState'
import { toast } from 'sonner'
import Loading from '@/components/shared/loading'
import { useHeader } from '@/hooks'
import { type ApiBase } from '@/models'
import { type State } from '@/modules/state/models/state.model' 

/*se agrego un boton para ver a detalle 
todo de un inmueble si no era necesario se pude borrar
esta en la linea: 136*/ 

export interface Sector extends ApiBase{
 nombre:string;  // esto se puso revisando el servicio del findAll que esta en dev
}

export interface NewState extends ApiBase {
  descripcion:string
   precio: number
   estado: string
   area: number
   NroHabitaciones: number
   NroBanos: number
   NroEstacionamientos:number
   sector:Sector   
}

export const columns: Array<ColumnDef<NewState>> = [
    {
      accessorKey: 'descripcion',
      header: () => <div>Descripción</div>,
      cell: ({ row }) => <div>{row.getValue('descripcion')}</div>
    },
    {
      accessorKey: 'precio',
      header: () => <div>Precio</div>,
      cell: ({ row }) => {
        const value = row.getValue('precio') as number
        return <div>${value.toLocaleString()}</div>
      }
    },
    {
      accessorKey: 'area',
      header: () => <div>Área (m²)</div>,
      cell: ({ row }) => <div>{row.getValue('area')} m²</div>
    },
    {
      accessorKey: 'NroHabitaciones',
      header: () => <div>Habitaciones</div>,
      cell: ({ row }) => <div>{row.getValue('NroHabitaciones') ?? '-'}</div>
    },
    {
      accessorKey: 'NroBanos',
      header: () => <div>Baños</div>,
      cell: ({ row }) => <div>{row.getValue('NroBanos') ?? '-'}</div>
    },
    {
      accessorKey: 'NroEstacionamientos',
      header: () => <div>Estacionamientos</div>,
      cell: ({ row }) => <div>{row.getValue('NroEstacionamientos') ?? '-'}</div>
    },
    {
      accessorKey: 'estado',
      header: () => <div>Estado</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue('estado')}</div>
    },
    {
      accessorKey: 'sector',
      header: () => <div>Sector</div>,
      cell: ({ row }) => {
        const sector = row.getValue('sector') as { nombre: string }
        return <div>{sector?.nombre ?? '-'}</div>
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      header: () => <div className='text-right'>Acciones</div>,
      cell: ({ row }) => {
        const [isDialogOpen, setIsDialogOpen] = React.useState(false)
        const navigation = useNavigate()
        const { deleteState } = useDeleteState()
  
        const deletePermanentlyState = () => {
          toast.promise(deleteState(row.original.id), {
            loading: 'Eliminando...',
            success: () => {
              setTimeout(() => {
                navigation(PrivateRoutes.STATE, { replace: true })
              }, 1000)
              return 'Estado eliminado exitosamente'
            },
            error(error) {
              return error.errorMessages?.[0] ?? 'No se pudo eliminar el estado.'
            }
          })
          setIsDialogOpen(false)
        };

      return (
        <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-bold">Acciones</DropdownMenuLabel>

        {/* Ver */}
        <DropdownMenuItem
          onClick={() => {
            navigation(`${PrivateRoutes.STATE}/view/${String(row.getValue('id'))}`)
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver
        </DropdownMenuItem>

        {/* Editar */}
        <DropdownMenuItem
          onClick={() => {
            navigation(`${PrivateRoutes.STATE}/${String(row.getValue('id'))}`)
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Eliminar */}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsDialogOpen(true);
          }}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Diálogo de confirmación fuera del menú */}
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de eliminar este inmueble?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El inmueble se eliminará permanentemente del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={deletePermanentlyState}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
      );
    }
  }
]

export function DataTableDemo() {
    useHeader([
      { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
      { label: 'Inmueble', path: PrivateRoutes.STATE } 
    ])
  
    const navigate = useNavigate()
    const { allStates, isLoading } = useGetAllState() ?? { allStates: [] }
  
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
  
    const newAllStates = React.useMemo(() => {
      return allStates?.map((state: State) => ({
        ...state,
        descripcion: state.descripcion,
        precio: state.precio,
        area: state.area,
        sector: state.sector.name,
      })) ?? []
    }, [allStates])
  
    const table = useReactTable({
      data: newAllStates,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection
      }
    })
  
    if (isLoading) {
      return <Loading />
    }
    return( 
            <div className="w-full">
              <CardHeader className="p-0">
                <CardTitle>Inmuebles</CardTitle>
                <CardDescription>Listado de todos los inmuebles registrados</CardDescription>
              </CardHeader>
          
              <div className="flex items-center py-4 justify-between">
                <div className="relative max-w-sm">
                  <Input
                    placeholder="Buscar inmueble..."
                    value={(table.getColumn('descripcion')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                      table.getColumn('descripcion')?.setFilterValue(event.target.value)
                    }
                    className="pl-10 pr-4"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
          
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => navigate(PrivateRoutes.STATE_CREAR)}
                >
                  <PlusCircleIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar inmueble
                  </span>
                </Button>
              </div>
          
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          {isLoading ? (
                            <div className="grid place-content-center place-items-center w-full shrink-0 pt-6">
                              <Loading />
                            </div>
                          ) : (
                            'No hay resultados.'
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
          
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} de{' '}
                  {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                </div>
                <div className="space-x-2">
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
          );
}