import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const CategoriesPage = lazy(() => import('@/modules/categories/pages/categories'))
const CategoryFormPage = lazy(() => import('@/modules/categories/pages/categories/form/CategoryFormPage'))

export const categoryRoutes: Route[] = [
  {
    path: PrivateRoutes.CATEGORIES,
    element: createElement(CategoriesPage),
    permissions: [PERMISSION.CATEGORY, PERMISSION.CATEGORY_SHOW]
  },
  {
    path: PrivateRoutes.CATEGORY_CREATE,
    element: createElement(CategoryFormPage),
    permissions: [PERMISSION.CATEGORY, PERMISSION.CATEGORY_CREATE]
  },
  {
    path: PrivateRoutes.CATEGORY_EDIT,
    element: createElement(CategoryFormPage),
    permissions: [PERMISSION.CATEGORY, PERMISSION.CATEGORY_UPDATE]
  }
]
