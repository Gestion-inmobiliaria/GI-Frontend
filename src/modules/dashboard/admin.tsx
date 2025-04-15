/* eslint-disable multiline-ternary */
import Pagination from '@/components/shared/pagination'
import Skeleton from '@/components/shared/skeleton'
import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
// import { AppConfig } from '@/config'
import { useHeader } from '@/hooks'
import { useGetAllResource } from '@/hooks/useApiResource'
// import { PrivateRoutes } from '@/models'
// import { type RootState } from '@/redux/store'
import { ENDPOINTS } from '@/utils'
// import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
// import { ArrowRight } from 'lucide-react'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
const DashboardAdminPage = (): React.ReactNode => {
  useHeader([{ label: 'Dashboard' }])
  // const data: any = useSelector((state: RootState) => state.user)
  const {
    allResource: realStates,
    isLoading,
    filterOptions,
    newPage,
    prevPage,
    setOffset,
    countData
  } = useGetAllResource({
    endpoint: ENDPOINTS.REALSTATE,
    isPagination: true
  })

  // const navigate = useNavigate()

  return (
    <>
      <Card
        x-chunk="dashboard-06-chunk-0"
        className="flex flex-col overflow-hidden w-full relative"
      >
        <CardHeader>
          <CardTitle>Todos las inmobiliarias</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden relative w-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>
                    <span className="sr-only">Opciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <Skeleton rows={filterOptions.limit} columns={8} />
                ) : (
                  realStates?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? 'default' : 'outline'}>
                          {item.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* <DropdownMenu
                          onOpenChange={() => {
                            setIsDialogOpen(false)
                          }}
                        >
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
                            <DropdownMenuItem
                              onClick={() => {
                                navigate(`${PrivateRoutes.USER}/${user.id}`)
                              }}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <AlertDialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                              >
                                <AlertDialogTrigger
                                  asChild
                                  className="w-full px-2 py-1.5"
                                >
                                  <div
                                    onClick={(event) => {
                                      event.stopPropagation()
                                    }}
                                    className={`${
                                      user.isActive ? 'text-danger' : ''
                                    } flex items-center`}
                                  >
                                    {user.isActive ? (
                                      <>
                                        <Trash className="mr-2 h-4 w-4" />
                                        Eliminar
                                      </>
                                    ) : (
                                      'Activar'
                                    )}
                                  </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {user.isActive
                                        ? 'Eliminar usuario'
                                        : 'Activar usuario'}
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  {user.isActive ? (
                                    <>
                                      <AlertDialogDescription>
                                        Esta acción eliminará el usuario, no se
                                        puede deshacer.
                                      </AlertDialogDescription>
                                      <AlertDialogDescription>
                                        ¿Estás seguro que deseas continuar?
                                      </AlertDialogDescription>
                                    </>
                                  ) : (
                                    <AlertDialogDescription>
                                      Para activar el usuario deberá contactarse
                                      con un administrador del sistema.
                                    </AlertDialogDescription>
                                  )}
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="h-fit">
                                      Cancelar
                                    </AlertDialogCancel>
                                    {user.isActive && (
                                      <AlertDialogAction
                                        className="h-full"
                                        onClick={() => {
                                          deletePermanentlyUser(user.id)
                                        }}
                                      >
                                        Continuar
                                      </AlertDialogAction>
                                    )}
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Pagination
            allItems={countData ?? 0}
            currentItems={realStates?.length ?? 0}
            limit={filterOptions.limit}
            newPage={() => {
              newPage(countData ?? 0)
            }}
            offset={filterOptions.offset}
            prevPage={prevPage}
            setOffset={setOffset}
            setLimit={() => {}}
            params={true}
          />
        </CardFooter>
      </Card>
    </>
  )
}

export default DashboardAdminPage
