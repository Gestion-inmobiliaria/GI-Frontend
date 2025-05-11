import Pagination from '@/components/shared/pagination'
import Skeleton from '@/components/shared/skeleton'
import { Badge } from '@/components/ui/badge'
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
import { useHeader } from '@/hooks'
import { useGetAllResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
const DashboardAdminPage = (): React.ReactNode => {
  useHeader([{ label: 'Dashboard' }])
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
