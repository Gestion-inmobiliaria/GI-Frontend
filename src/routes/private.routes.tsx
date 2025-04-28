import { lazy } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { Route, Routes } from 'react-router-dom'
import { PrivateAllRoutes } from './utils/routes.utils'
import { HeaderProvider } from '@/context/headerContext'
import { SidebarProvider } from '@/context/sidebarContext'
import DashboardAdminPage from '@/modules/dashboard/admin'
import { useAuthorization } from '@/hooks/useAuthorization'



const Layout = lazy(() => import('@/layout/index'))

const Private = () => {
  const { verifyPermission } = useAuthorization()
  const data = useSelector((state: RootState) => state.user)
  const isAdmin = data?.role?.name === 'Administrador SU'
  const customerRoute = (
    <Route
      element={
        <SidebarProvider>
          <HeaderProvider>
            <Layout />
          </HeaderProvider>
        </SidebarProvider>
      }
    >
      {PrivateAllRoutes.map(({ element, path, permissions }, index) => {
        if (permissions?.length === 0 || verifyPermission(permissions!)) {
          return <Route key={index} path={path} element={element} />
        } else {
          return undefined
        }
      })}
    </Route>
  )

  const adminRoute = (
    <Route
      element={
        <SidebarProvider>
          <HeaderProvider>
            <Layout />
          </HeaderProvider>
        </SidebarProvider>
      }
    >
      <Route path='/app' element={<DashboardAdminPage />} />
    </Route>
  )

  return (
    <Routes>
      {isAdmin ? adminRoute : customerRoute}
    </Routes>
  )
}

export default Private
