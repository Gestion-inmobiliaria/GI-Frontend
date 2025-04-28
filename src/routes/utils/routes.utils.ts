import { userRoutes } from '.'
import { createElement, lazy } from 'react'
const NotFound = lazy(() => import('@/components/not-found'))
const DashboardPage = lazy(() => import('@modules/dashboard'))
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import UploadExcelPage from '@/modules/realStates/pages/uploadExcel'
const SettingPage = lazy(() => import('@modules/settings/pages/setting'))
const SubscriptionPage = lazy(() => import('@modules/subscription/pages'))
const PlanSubscriptionPage = lazy(() => import('@modules/subscription/pages/plan-subscription'))
const PlanSubscriptionSuccessPage = lazy(() => import('@modules/subscription/pages/plan-subscription/success'))



export const PrivateAllRoutes: Route[] = [
  {
    path: '/*',
    element: createElement(NotFound),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.DASHBOARD,
    element: createElement(DashboardPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SETTINGS,
    element: createElement(SettingPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SUBSCRIPTION,
    element: createElement(SubscriptionPage),
    permissions: [PERMISSION.SUBSCRIPTION]
  },
  {
    path: PrivateRoutes.SUBSCRIPTION_PLAN,
    element: createElement(PlanSubscriptionPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SUBSCRIPTION_PLAN_SUCCESS,
    element: createElement(PlanSubscriptionSuccessPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.REGISTRO_MASIVO,
    element: createElement(UploadExcelPage),
    permissions: [PERMISSION.USER_SHOW], // Permitir acceso al Usuario básico
  },
  ...userRoutes
]
