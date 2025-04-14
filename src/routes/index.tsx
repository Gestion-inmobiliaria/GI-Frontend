import { Route, Routes as BaseRoutes } from 'react-router-dom'
import ProtectedRoute from './protectedRoute'
import Private from './private.routes'
import { lazy, Suspense } from 'react'
import { PrivateRoutes, PublicRoutes } from '@/models/routes.model'
import Loading from '@/components/shared/loading'

const LoginPage = lazy(() => import('@modules/auth/pages/login'))
const RegisterPage = lazy(() => import('@modules/auth/pages/register'))
const LandingPage = lazy(() => import('@modules/landing'))
// const SubscriptionPage = lazy(() => import('@modules/subscription/pages'))

const Routes = () => {
  return (
    <BaseRoutes>
      {/* Rutas públicas, pero si ya está autenticado ocultar dichas rutas */}
      <Route element={
        <Suspense
          fallback={
            <div className='grid place-content-center place-items-center min-h-[calc(100dvh-55px-54px)] lg:min-h-[calc(100dvh-63px-54px)] text-action text-light-action dark:text-dark-action'>
              <Loading />
            </div>
          }
        >
          <ProtectedRoute redirectTo={PrivateRoutes.DASHBOARD} />
        </Suspense>
      }>
        <Route path={PublicRoutes.LOGIN} element={<LoginPage />} />
        <Route path={PublicRoutes.LANDING} element={<LandingPage />} />
        <Route path={PublicRoutes.REGISTER} element={<RegisterPage />} />
        {/* <Route path={PublicRoutes.SUBSCRIPTION} element={<SubscriptionPage />} /> */}
      </Route>
      {/* Rutas privadas */}
      <Route element={<ProtectedRoute isPrivate redirectTo={PublicRoutes.LANDING} />}>
        <Route path='/*' element={<Private />} />
      </Route>
    </BaseRoutes >
  )
}

export default Routes
