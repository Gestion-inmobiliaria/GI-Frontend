import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const ImpulsarPage = lazy(() => import('@modules/impulsar_inmueble/pages/index'));
const CrearImpulsoPage = lazy(() => import ('@/modules/impulsar_inmueble/pages/CrearImpulsoPage'));
const EditarImpulsoPage = lazy(() => import('@modules/impulsar_inmueble/pages/EditarImpulso'));
const CancelarImpulsoForm = lazy(() => import('@/modules/impulsar_inmueble/pages/CancelarImpulsoForm'));
const ImpulsoDetailPage = lazy( () => import('@/modules/impulsar_inmueble/pages/impulsoDetailPage'));
export const impulsoRoutes: Route[] = [
  {
    path: PrivateRoutes.IMPULSO,
    element: createElement(ImpulsarPage),
    permissions: [
      PERMISSION.SECTOR,
      PERMISSION.SECTOR_SHOW,
      PERMISSION.SECTOR_CREATE,
      PERMISSION.SECTOR_UPDATE,
      PERMISSION.SECTOR_DELETE,
    ],
  },
  {
    path: PrivateRoutes.IMPULSO_CREATE,
    element: createElement(CrearImpulsoPage),
    permissions: [
      PERMISSION.SECTOR,
      PERMISSION.SECTOR_SHOW,
      PERMISSION.SECTOR_CREATE,
    ],
  },
  {
    path: PrivateRoutes.IMPULSO_EDIT,
    element: createElement(EditarImpulsoPage),
    permissions: [
      PERMISSION.SECTOR,
      PERMISSION.SECTOR_SHOW,
      PERMISSION.SECTOR_UPDATE,
    ],
  },
  {
    path: PrivateRoutes.IMPULSO_CANCELAR,
    element: createElement(CancelarImpulsoForm),
    permissions: [
      PERMISSION.SECTOR,
      PERMISSION.SECTOR_SHOW,
      PERMISSION.SECTOR_UPDATE,
    ],
  },
  {
    path: PrivateRoutes.IMPULSO_DETAIL,
    element: createElement(ImpulsoDetailPage),
    permissions: [
      PERMISSION.SECTOR,
      PERMISSION.SECTOR_SHOW,
      PERMISSION.SECTOR_UPDATE,
    ],
  },
];