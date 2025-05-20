import { lazy, createElement } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
const MapaPage = lazy(() => import('@/modules/maps/pages'))

export const mapRoutes: Route[] = [
  {
    path: PrivateRoutes.MAPA,
    element: createElement(MapaPage),
    permissions: [PERMISSION.MAP_VIEW] 
  }
]
