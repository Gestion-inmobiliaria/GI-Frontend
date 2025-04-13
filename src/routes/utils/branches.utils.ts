import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const BranchesPage = lazy(() => import('@/modules/branches/pages/branches'))
const BranchFormPage = lazy(() => import('@/modules/branches/pages/branches/components/branch-form'))

export const branchRoutes: Route[] = [
  {
    path: PrivateRoutes.BRANCH,
    element: createElement(BranchesPage),
    permissions: [PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW]
  },
  {
    path: PrivateRoutes.BRANCH_CREATE,
    element: createElement(BranchFormPage, { title: 'Crear Sucursal', buttonText: 'Guardar Sucursal' }),
    permissions: [PERMISSION.BRANCH]
  },
  {
    path: PrivateRoutes.BRANCH_EDIT,
    element: createElement(BranchFormPage, { title: 'Actualizar Sucursal', buttonText: 'Guardar Cambios' }),
    permissions: [PERMISSION.BRANCH]
  }
] 