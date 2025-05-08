import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ListFilter, MoreHorizontal, PlusCircle, Search, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useDeleteState, useGetAllState } from '../../hooks/useState'
import { type State } from '../../models/state.model'
import { Badge } from '@/components/ui/badge'
import { useHeader } from '@/hooks'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'

const StatePage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Inmuebles' }
  ])
  const navigate = useNavigate()
  const { allStates, countData, isLoading, mutate, filterOptions, newPage, prevPage, setOffset, search } = useGetAllState()
  const { deleteState } = useDeleteState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchState, setSearchState] = useState('')
  const debounceSearchState = useDebounce(searchState, 1000)

  const deletePermanentlyState = (id: string) => {
    toast.promise(deleteState(id), {
      loading: 'Cargando...',
      success: () => {
        void mutate()
        setTimeout(() => {
          navigate(PrivateRoutes.STATE, { replace: true })
        }, 1000)
        return 'Inmueble eliminado exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Puede que el Inmueble tenga dependencias, por lo que no se puede eliminar'
      }
    })
    setIsDialogOpen(false)
  }

  useEffect(() => {
    search('name', debounceSearchState)
  }, [debounceSearchState])

  return (
    <section className='grid gap-4 overflow-hidden w-full relative'>
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(-1) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <form className='py-1' onSubmit={(e) => { e.preventDefault() }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar"
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
              onChange={(e) => { setSearchState(e.target.value) }}
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='ml-auto'>
            <Button variant="outline" size="sm" className="h-8 gap-1"><ListFilter className="h-3.5 w-3.5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Activo</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={() => { navigate(PrivateRoutes.STATE_CREAR) }} size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar</span>
        </Button>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Todos los Inmuebles</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
          <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Descripción</TableHead>
      <TableHead>Precio</TableHead>
      <TableHead>Estado</TableHead>
      <TableHead>Categoría</TableHead>
      <TableHead>Modalidad</TableHead>
      <TableHead>Sector</TableHead>
      <TableHead><span className="sr-only">Opciones</span></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {isLoading ? (
      <Skeleton rows={filterOptions.limit} columns={7} />
    ) : (
      allStates?.map((state: State) => (
        <TableRow key={state.id}>
          <TableCell>{state.descripcion}</TableCell>
          <TableCell>${state.precio}</TableCell>
          <TableCell>
            <Badge variant={state.estado === 'disponible' ? 'default' : 'outline'}>
              {state.estado}
            </Badge>
          </TableCell>
          <TableCell>{state.category}</TableCell>
          <TableCell>{state.modality}</TableCell>
          <TableCell>{state.sector.name}</TableCell>
          <TableCell>
            <DropdownMenu onOpenChange={() => setIsDialogOpen(false)}>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(`${PrivateRoutes.STATE}/${state.id}`)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
  <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <AlertDialogTrigger asChild className="w-full px-2 py-1.5">
      <div
        onClick={(event) => event.stopPropagation()}
        className={`${state.estado === 'disponible' ? 'text-danger' : ''} flex items-center`}
      >
        {state.estado === 'disponible' ? (
          <>
            <Trash className="mr-2 h-4 w-4" />
            Marcar como ocupado
          </>
        ) : (
          'Marcar como disponible'
        )}
      </div>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {state.estado === 'disponible' ? 'Ocupar inmueble' : 'Activar inmueble'}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        {state.estado === 'disponible'
          ? '¿Estás seguro de que deseas marcar este inmueble como ocupado?'
          : '¿Estás seguro de que deseas marcar este inmueble como disponible?'}
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel className="h-fit">Cancelar</AlertDialogCancel>
        <AlertDialogAction
          className="h-full"
          onClick={() => deletePermanentlyState(state.id)} 
        >
          Continuar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
          </div>
        </CardContent>
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allStates?.length ?? 0}
            limit={filterOptions.limit}
            newPage={() => { newPage(countData ?? 0) }}
            offset={filterOptions.offset}
            prevPage={prevPage}
            setOffset={setOffset}
            setLimit={() => { }}
            params={true}
          />
        </CardFooter>
      </Card>
    </section>
  )
}
export default StatePage