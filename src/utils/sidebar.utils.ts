import { createElement } from 'react'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { UserCogIcon, UserIcon, UsersIcon, KeyIcon, CreditCardIcon, MapPinIcon, ClipboardListIcon, NotebookIcon, FolderIcon, MapIcon, FileTextIcon } from 'lucide-react'



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
    permissions: [
      PERMISSION.USER,
      PERMISSION.USER_SHOW,
      PERMISSION.ROLE,
      PERMISSION.ROLE_SHOW,
      PERMISSION.PERMISSION,
      PERMISSION.PERMISSION_SHOW
    ],
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
    label: 'Gestionar Inmobiliarias',
    icon: createElement(MapPinIcon, { width: 20, height: 20 }),
    path: '/realstate',
    permissions: [
      PERMISSION.SECTOR,
      PERMISSION.SECTOR_SHOW,
      PERMISSION.SECTOR_CREATE,
      PERMISSION.SECTOR_UPDATE,
      PERMISSION.SECTOR_DELETE
    ],
    children: [
      {
        label: 'Gestionar Sectores',
        icon: createElement(MapPinIcon, { width: 20, height: 20 }),
        path: '/sectores',
        permissions: [
          PERMISSION.SECTOR,
          PERMISSION.SECTOR_SHOW,
          PERMISSION.SECTOR_CREATE,
          PERMISSION.SECTOR_UPDATE,
          PERMISSION.SECTOR_DELETE
        ]
      }
    ]
  },
  {
    label: 'Gestionar Inmuebles',
    icon: createElement(MapPinIcon, { width: 20, height: 20 }),
    path: '/state',
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW, PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR_DELETE],
    children: [
      {
        label: 'Gestionar Inmueble',
        icon: createElement(MapPinIcon, { width: 20, height: 20 }),
        path: '/state',
        permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW, PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR_DELETE]
      },
      {
        label: 'Modalidades',
        icon: createElement(NotebookIcon, { width: 20, height: 20 }),
        path: '/modalidades',
        permissions: [
          PERMISSION.MODALITY,
          PERMISSION.MODALITY_SHOW
        ]
      },
      {
        label: 'Gestionar Categorías',
        icon: createElement(FolderIcon, { width: 20, height: 20 }),
        path: '/categorias',
        permissions: [
          PERMISSION.CATEGORY,
          PERMISSION.CATEGORY_SHOW,
          PERMISSION.CATEGORY_CREATE,
          PERMISSION.CATEGORY_UPDATE,
          PERMISSION.CATEGORY_DELETE
        ]
      }
    ]
  },
  {
    label: 'Contratos',
    icon: createElement(FileTextIcon, { width: 20, height: 20 }),
    path: '/contratos',
    permissions: [PERMISSION.USER, PERMISSION.USER], // TODO: Cambiar a CONTRACT
    children: [
      {
        label: 'Generar Contrato',
        icon: createElement(FileTextIcon, { width: 20, height: 20 }),
        path: '/contratos',
        permissions: [PERMISSION.USER, PERMISSION.USER] // TODO: Cambiar a CONTRACT
      }
    ]
  },
  {
    label: 'Mapa',
    icon: createElement(MapIcon, { width: 20, height: 20 }),
    path: '/mapa',
    permissions: [PERMISSION.MAP_VIEW]
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
    permissions: [PERMISSION.LOG, PERMISSION.LOG_SHOW]
  }
]
