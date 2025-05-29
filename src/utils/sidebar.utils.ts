import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { UserCogIcon, UserIcon, UsersIcon, KeyIcon, CreditCardIcon, MapPinIcon, ClipboardListIcon, NotebookIcon, FolderIcon,Building2Icon, SettingsIcon, DatabaseIcon } from 'lucide-react'
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
    icon: createElement(Building2Icon, { width: 20, height: 20 }),
    path: '/state',
    permissions: [PERMISSION.SECTOR, PERMISSION.SECTOR_SHOW, PERMISSION.SECTOR_CREATE, PERMISSION.SECTOR_UPDATE, PERMISSION.SECTOR_DELETE],
    children: [
      {
        label: 'Gestionar Inmueble',
        icon: createElement(Building2Icon, { width: 20, height: 20 }),
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
  },
  {
   label: 'Configuraciones',
    icon: createElement(SettingsIcon, { width: 20, height: 20 }),
    path: 'settings',
     permissions: [PERMISSION.LOG, PERMISSION.LOG_SHOW/*PERMISSION.BACKUP_CREATE, PERMISSION.BACKUP_RESTORE*/],
  children: [
    {
      label: 'Backup & Restore',
      icon: createElement(DatabaseIcon, { width: 20, height: 20 }),
      path: '/settings/backup',
       permissions: [PERMISSION.LOG, PERMISSION.LOG_SHOW/*PERMISSION.BACKUP_CREATE, PERMISSION.BACKUP_RESTORE*/]
    }
  ]
},
]