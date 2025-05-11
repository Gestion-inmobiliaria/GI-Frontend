import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const StateFormPage = lazy(() => import('@modules/state/pages/state/components/state-form'))
const StatePage= lazy(() => import('@/modules/state/pages/state/index'))
export const stateRoutes: Route[] = [
  {
    path: PrivateRoutes.STATE,
    element: createElement(StatePage),
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW, PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR_DELETE],
  },
  {
    path: PrivateRoutes.STATE_CREAR,
    element: createElement(StateFormPage, { buttonText: 'Guardar propiedad', title: 'Crear propiedad' }),
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW, PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR_DELETE],
  },
  {
    path: PrivateRoutes.STATE_EDIT,
    element: createElement(StateFormPage, { buttonText: 'Editar propiedad', title: 'Actualizar propiedad' }),
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW, PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR_DELETE],
  },
]