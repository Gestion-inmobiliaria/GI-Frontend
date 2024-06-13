import { PrivateRoutes } from '@/models/routes.model'
import { File, ListFilterIcon, MoreHorizontal, PlusCircleIcon } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent
} from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'
import { useHeader } from '@/hooks'
import { useGetAllPurchaseOrders } from '../../hooks/usePurchaseOrder'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { FormatDateMMMDYYYYHHMM } from '@/utils'

const PurchaseOrderPage = () => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Compras', path: PrivateRoutes.COMPANY },
    { label: 'Ordenes de compra' }
  ])
  const { purchaseOrders, filterOptions, isLoading, newPage, prevPage, setOffset, countData } = useGetAllPurchaseOrders({ isGetAll: false })
  const navigate = useNavigate()
  //   const { branches, isLoading, error } = useGetAllBranches()

  //   let subscribe = true
  //   useEffect(() => {
  //     if (subscribe && error) {
  //       toast.error(error.errorMessages[0])
  //     }
  //     return () => {
  //       subscribe = false
  //     }
  //   }, [error])

  return (
    <Tabs defaultValue="week" className='grid gap-2 overflow-hidden w-full relative'>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-sm"
              >
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Todos
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 text-sm"
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Exportar</span>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => { navigate(PrivateRoutes.PURCHASE_ORDER_CREATE) }}>
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Agregar Orden
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="week" className='relative overflow-hidden'>
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Ordenes de Compra</CardTitle>
            <CardDescription>
              Listado de todas las ordenes de compra.
            </CardDescription>
          </CardHeader>
          <CardContent className='overflow-hidden relative w-full'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y hora</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>
                      Estado
                    </TableHead>
                    {/* <TableHead className="hidden md:table-cell">Productos</TableHead> */}
                    <TableHead><div className='sr-only'></div></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {branches?.length === 0 && <div>No hay sucursales</div>} */}
                  {isLoading
                    ? <Skeleton rows={filterOptions.limit} columns={6} />
                    : purchaseOrders?.map((purchaseOrder) => (
                      <TableRow key={purchaseOrder.id}>
                        <TableCell>{FormatDateMMMDYYYYHHMM(purchaseOrder.createdAt)}</TableCell>
                        <TableCell title={purchaseOrder.reason}>
                          {purchaseOrder.reason
                            ? (purchaseOrder.reason.length > 40 ? purchaseOrder.reason.substring(0, 40) + '...' : purchaseOrder.reason)
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{purchaseOrder.provider.name}</TableCell>
                        <TableCell>{purchaseOrder.state}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => { }}>Ver detalle</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { }}>Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { }}>Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <Pagination
              allItems={countData ?? 0}
              currentItems={purchaseOrders?.length ?? 0}
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
      </TabsContent>
    </Tabs>
  )
}

export default PurchaseOrderPage
