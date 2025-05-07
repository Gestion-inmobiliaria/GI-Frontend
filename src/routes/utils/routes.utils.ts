import { createElement, lazy } from 'react'
import { userRoutes, sectorRoutes } from '.'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { stateRoutes } from './state.utils'

const DashboardPage = lazy(() => import('@modules/dashboard'))
const SettingPage = lazy(() => import('@modules/settings/pages/setting'))
const NotFound = lazy(() => import('@/components/not-found'))
const SubscriptionPage = lazy(() => import('@modules/subscription/pages'))
const PlanSubscriptionPage = lazy(() => import('@modules/subscription/pages/plan-subscription'))
const PlanSubscriptionSuccessPage = lazy(() => import('@modules/subscription/pages/plan-subscription/success'))

export const PrivateAllRoutes: Route[] = [
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
  ...userRoutes,
  ...sectorRoutes,
  ...stateRoutes,
  {
    path: '/*',
    element: createElement(NotFound),
    permissions: [] as PERMISSION[]
  },
]
