import { createElement } from 'react'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { UserCogIcon, UserIcon, UsersIcon, KeyIcon, CreditCardIcon, UploadIcon } from 'lucide-react'



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
        label: 'Subscripción',
        icon: createElement(CreditCardIcon, { width: 20, height: 20 }),
        path: '/subscripcion',
        permissions: [PERMISSION.SUBSCRIPTION]
    },
    {
        label: 'Registro masivo de Inmuebles',
        icon: createElement(UploadIcon, { width: 20, height: 20 }),
        path: '/registro-masivo',
        permissions: [PERMISSION.USER_SHOW], // Permitir acceso al Usuario básico
    }
]
