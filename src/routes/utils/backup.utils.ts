import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'


const BackupPage= lazy(() => import('@/modules/backup/pages/backup/index'))

export const backupRoutes: Route[] = [
  {
    path: PrivateRoutes.BACKUP,
    element: createElement(BackupPage),
    permissions: [PERMISSION.LOG, PERMISSION.LOG_SHOW],
  },
]