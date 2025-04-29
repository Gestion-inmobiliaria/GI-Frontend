import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const SectorsPage = lazy(() => import('@modules/sectors/pages/sectors'))
const SectorFormPage = lazy(() => import('@modules/sectors/pages/sectors/components/sector-form'))

export const sectorRoutes: Route[] = [
  {
    path: PrivateRoutes.SECTORS,
    element: createElement(SectorsPage),
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW]
  },
  {
    path: PrivateRoutes.SECTOR_CREATE,
    element: createElement(SectorFormPage, { buttonText: 'Guardar Sector', title: 'Crear Sector' }),
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_CREATE]
  },
  {
    path: PrivateRoutes.SECTOR_EDIT,
    element: createElement(SectorFormPage, { buttonText: 'Editar Sector', title: 'Actualizar Sector' }),
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_UPDATE]
  }
] 