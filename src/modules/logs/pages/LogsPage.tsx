import React from 'react'
import { CustomPagination } from '@/components/ui/pagination'
import { LogsTable } from '../components/LogsTable'
import { LogsFilter } from '../components/LogsFilter'
import { useLogs } from '../hooks/useLogs'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const LogsPage: React.FC = () => {
  const {
    logs,
    totalLogs,
    isLoading,
    queryParams,
    handleSearch,
    handleDateFilter,
    handlePageChange
  } = useLogs()

  const totalPages = Math.ceil((totalLogs || 0) / (queryParams.limit ?? 10))

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bitácora del Sistema</h1>
        <p className="text-muted-foreground">
          Registro de todas las acciones realizadas en el sistema
        </p>
      </div>

      <LogsFilter
        onSearch={handleSearch}
        onDateFilter={handleDateFilter}
      />

      <LogsTable logs={logs} isLoading={isLoading} />

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <CustomPagination
            page={queryParams.page ?? 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

// Definir los permisos requeridos para acceder a esta página
interface LogsPageComponent extends React.FC {
  requiredPermissions?: string[]
}

const LogsPageWithPermissions = LogsPage as LogsPageComponent
LogsPageWithPermissions.requiredPermissions = [PERMISSION.LOG_SHOW]

export default LogsPageWithPermissions
