import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'



export enum PublicRoutes {
    LOGIN = '/login',
    RESET_PASSWORD = '/reset-password',
    LANDING = '/',
    REGISTER = '/register',
    SUBSCRIPTION = '/subscripcion',
}

export enum PrivateRoutes {
    DASHBOARD = '/app',
    SETTINGS = '/configuracion',
    SUBSCRIPTION = '/subscripcion',
    SUBSCRIPTION_PLAN = '/subscripcion/:id',
    SUBSCRIPTION_PLAN_SUCCESS = '/subscripcion/:id/success',
    REALSTATE = '/realstate',
    // users
    USER = '/usuarios',
    USER_CREAR = PrivateRoutes.USER + '/crear',
    USER_EDIT = PrivateRoutes.USER + '/:id',
    ROLES = PrivateRoutes.USER + '/roles',
    ROLE_FORM = PrivateRoutes.ROLES + '/crear',
    ROLE_EDIT = PrivateRoutes.ROLES + '/:id',
    PERMISSIONS = PrivateRoutes.USER + '/permisos',
    PERMISSIONS_CREATE = PrivateRoutes.PERMISSIONS + '/crear',
    PERMISSIONS_EDIT = PrivateRoutes.PERMISSIONS + '/:id',
    REGISTRO_MASIVO = '/registro-masivo'
}

export interface Route {
    path: PrivateRoutes | PublicRoutes | '/*'
    element: JSX.Element | JSX.Element[]
    permissions?: PERMISSION[]
}
