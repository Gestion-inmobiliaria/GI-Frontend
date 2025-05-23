import * as React from 'react'
import {
  type ColumnFiltersState, type SortingState, type VisibilityState, type ColumnDef,
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
  Row
} from '@tanstack/react-table'
import { MoreHorizontal, Search, PlusCircleIcon, Trash, Pencil, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { 
DropdownMenu,
DropdownMenuContent, 
DropdownMenuItem, 
DropdownMenuLabel, 
DropdownMenuSeparator, 
DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
import { EstadoBadge } from './estadoBadge'

export interface Categoria extends ApiBase{name:string;};

export interface Usuario extends ApiBase{name:string;};

export interface Modalidad extends ApiBase{ name:string;}

export interface Sector extends ApiBase{name:string;}

export interface NewState extends ApiBase {
  descripcion:string
   precio: number
   estado: string
   area: number
   NroHabitaciones: number
   NroBanos: number
   NroEstacionamientos:number
   user:Usuario
   category:Categoria
   modality:Modalidad
   sector:Sector
}
const ActionsCell: React.FC<{ row: Row<NewState>, onDeleted: () => void }> = ({ row, onDeleted }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const navigation = useNavigate();
  const { deleteState } = useDeleteState();

  const deletePermanentlyState = async () => {
   try{
    await toast.promise(deleteState(row.original.id), {
      loading: 'Eliminando...',
      success: () => {
      return 'Inmueble eliminado exitosamente';
      },
      error(error) {
        return error.errorMessages?.[0] ?? 'No se pudo eliminar el inmueble.';
      }
    });
    setIsDialogOpen(false);
    await onDeleted(); 
  } catch (error) {
    toast.error('Error al eliminar el inmueble.');
  }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigation(`${PrivateRoutes.STATE}/detalle/${row.original.id}`)}>
            <Eye className="mr-2 h-4 w-4" /> Ver detalle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigation(`${PrivateRoutes.STATE}/${row.original.id}`)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deletePermanentlyState}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function DataTableDemo() {
    useHeader([
      { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
      { label: 'Inmueble', path: PrivateRoutes.STATE } 
    ])
  
    const navigate = useNavigate()
   const { allStates = [], isLoading = false, mutate } = useGetAllState();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
  
    const newAllStates = React.useMemo(() => {
      return allStates?.map((state: State) => ({
        ...state,
        user: state.user.name,
        category: state.category.name,
        modality: state.modality.name,
        sector: state.sector.name,
      })) ?? []
    }, [allStates])

   const columns = React.useMemo<ColumnDef<NewState>[]>(
    () => [
    {
      accessorKey: 'descripcion',
      header: () => <div>Descripción</div>,
      cell: ({ row }) => (
       <div className="max-w-[200px] truncate" title={row.getValue('descripcion')}>
         {row.getValue('descripcion')}
        </div>
        )
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
      cell: ({ row }) => {
        const value = row.getValue('area') as number
        return <div>{value} m²</div>
      }
    },
    {
     accessorKey: 'estado',
  header: () => <div>Estado</div>,
  cell: ({ row }) => {
    const estado = row.getValue('estado') as string;
    return <EstadoBadge estado={estado} />;
  },
    },
    {
      accessorKey: 'user',
      header: () => <div>Usuario</div>,
      cell: ({ row }) => {
        const usuario = row.getValue('user') as string 
        return <div>{usuario ?? '-'}</div>
      }
    },
    {
      accessorKey: 'category',
      header: () => <div>Categoria</div>,
      cell: ({ row }) => {
        const categoria = row.getValue('category') as string
        return <div>{categoria ?? '-'}</div>
      }
    },
    {
      accessorKey: 'modality',
      header: () => <div>Modalidad</div>,
      cell: ({ row }) => {
        const modalidad = row.getValue('modality') as string
        return <div>{modalidad ?? '-'}</div>
      }
    },
    {
      accessorKey: 'sector',
      header: () => <div>Sector</div>,
      cell: ({ row }) => {
        const sector = row.getValue('sector') as string 
        return <div>{sector ?? '-'}</div>
      }
    },
    {
     id: 'actions',
     enableHiding: false,
     header: () => <div className='text-right'>Acciones</div>,
     cell: ({ row }) => <ActionsCell row={row} onDeleted={mutate} />
    },
  ],
  [mutate]
  );

    const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5, // Puedes cambiar este valor a 5, 20, etc.
    })
  
    const table = useReactTable({
      data: newAllStates,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onPaginationChange: setPagination,
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
        rowSelection,
        pagination
      }
    })
  
    if (isLoading)return <Loading />

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
          
              <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[900px]">
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
          
              <div className="flex items-center justify-between space-x-2 py-4">
  {/* Texto de selección y página actual */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground">
    <div>
      Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
    </div>
  </div>

  {/* Botones de navegación */}
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