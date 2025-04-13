// import { PrivateRoutes } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { UserCogIcon, UserIcon, UsersIcon, KeyIcon, BuildingIcon } from 'lucide-react'
import { createElement } from 'react'

export interface MenuHeaderRoute {
  path?: string
  label: string
  icon?: JSX.Element
  children?: MenuHeaderRoute[]
  permissions?: PERMISSION[]
}

export const MenuSideBar: MenuHeaderRoute[] = [
  {
    label: 'Gestión de Usuarios',
    icon: createElement(UserCogIcon, { width: 20, height: 20 }),
    path: '/usuarios',
    permissions: [PERMISSION.USER, PERMISSION.USER_SHOW, PERMISSION.ROLE, PERMISSION.ROLE_SHOW, PERMISSION.PERMISSION, PERMISSION.PERMISSION_SHOW],
    children: [
      {
        path: '/usuarios',
        label: 'Usuarios',
        icon: createElement(UsersIcon, { width: 20, height: 20 }),
        permissions: [PERMISSION.USER, PERMISSION.USER_SHOW]
      },
      {
        path: '/usuarios/roles',
        label: 'Roles',
        icon: createElement(UserIcon, { width: 20, height: 20 }),
        permissions: [PERMISSION.ROLE, PERMISSION.ROLE_SHOW]
      },
      {
        path: '/usuarios/permisos',
        label: 'Permisos',
        icon: createElement(KeyIcon, { width: 20, height: 20 }),
        permissions: [PERMISSION.PERMISSION, PERMISSION.PERMISSION_SHOW]
      }
    ]
  },
  {
    label: 'Gestión de Sucursales',
    icon: createElement(BuildingIcon, { width: 20, height: 20 }),
    path: '/sucursales',
    permissions: [PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW],
    children: [
      {
        path: '/sucursales',
        label: 'Sucursales',
        icon: createElement(BuildingIcon, { width: 20, height: 20 }),
        permissions: [PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW]
      }
    ]
  }
]
