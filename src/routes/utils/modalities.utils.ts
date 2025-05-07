import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const ModalitiesPage = lazy(() => import('@/modules/modalities/pages/modalities'))

export const modalityRoutes: Route[] = [
  {
    path: PrivateRoutes.MODALITIES,
    element: createElement(ModalitiesPage),
    permissions: [PERMISSION.MODALITY, PERMISSION.MODALITY_SHOW]
  }
]
