import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

const LogsPage = lazy(() => import('@/modules/logs/pages/LogsPage'))

export const logRoutes: Route[] = [
  {
    path: PrivateRoutes.LOGS,
    element: createElement(LogsPage),
    permissions: [] as PERMISSION[]
  }
]
