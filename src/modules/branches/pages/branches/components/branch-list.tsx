import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PrivateRoutes } from '@/models/routes.model'
import { useBranches } from '@/modules/branches/hooks/useBranches'
import { IBranch } from '@/modules/branches/interfaces/branch.interface'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/shared/pagination'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { EditIcon, SearchIcon, Trash2Icon, PlusIcon, BuildingIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Loading from '@/components/shared/loading'

const BranchList = (): React.ReactNode => {
  const navigate = useNavigate()
  const { getBranches, deleteBranch, branches, loading, totalBranches } = useBranches()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchColumn, setSearchColumn] = useState<string>('name')
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranches = async () => {
      const params: any = {
        limit,
        offset: (page - 1) * limit
      }
      
      if (searchTerm) {
        params.attr = searchColumn
        params.value = searchTerm
      }
      
      await getBranches(params)
    }
    
    fetchBranches()
  }, [getBranches, page, limit, searchTerm, searchColumn])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const handleColumnChange = (value: string) => {
    setSearchColumn(value)
    setPage(1)
  }

  const handleDeleteBranch = async () => {
    if (branchToDelete) {
      const success = await deleteBranch(branchToDelete)
      if (success) {
        setBranchToDelete(null)
        await getBranches({
          limit,
          offset: (page - 1) * limit,
          attr: searchTerm ? searchColumn : undefined,
          value: searchTerm || undefined
        })
      }
    }
  }

  return (
    <div className="w-full">
      <Card x-chunk="dashboard-05-chunk-3">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Sucursales</h2>
            </div>
            <Button onClick={() => navigate(PrivateRoutes.BRANCH_CREATE)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Sucursal
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar sucursales..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Select value={searchColumn} onValueChange={handleColumnChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Columna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="address">Dirección</SelectItem>
                <SelectItem value="phone">Teléfono</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loading />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.length > 0 ? (
                      branches.map((branch: IBranch) => (
                        <TableRow key={branch.id}>
                          <TableCell className="font-medium">{branch.name}</TableCell>
                          <TableCell>{branch.address}</TableCell>
                          <TableCell>{branch.phone || '-'}</TableCell>
                          <TableCell>{branch.email || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {branch.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link to={PrivateRoutes.BRANCH_EDIT.replace(':id', branch.id)}>
                                <EditIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setBranchToDelete(branch.id)}
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción desactivará la sucursal "{branch.name}" y no podrá ser utilizada en el sistema.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setBranchToDelete(null)}>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteBranch}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No se encontraron sucursales
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  itemsPerPage={limit}
                  totalItems={totalBranches}
                  onPageChange={setPage}
                  onItemsPerPageChange={setLimit}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default BranchList 