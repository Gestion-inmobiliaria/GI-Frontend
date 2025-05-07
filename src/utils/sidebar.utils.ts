// import { PrivateRoutes } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { UserCogIcon, UserIcon, UsersIcon, KeyIcon, CreditCardIcon, MapPinIcon, ClipboardListIcon } from 'lucide-react'
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
    label: 'Gestionar Sectores',
    icon: createElement(MapPinIcon, { width: 20, height: 20 }),
    path: '/sectores',
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW, PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR_DELETE]
  },
  {
    label: 'Subscripción',
    icon: createElement(CreditCardIcon, { width: 20, height: 20 }),
    path: '/subscripcion',
    permissions: [PERMISSION.SUBSCRIPTION]
  },
  {
    label: 'Bitácora',
    icon: createElement(ClipboardListIcon, { width: 20, height: 20 }),
    path: '/bitacora',
    permissions: [PERMISSION.LOG, PERMISSION.LOG_SHOW] // aqui esta, esto no estaba aware
  }
]
