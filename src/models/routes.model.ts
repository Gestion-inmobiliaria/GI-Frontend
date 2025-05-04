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

  // Real state
  REALSTATE = '/realstate',

  // Users
  USER = '/usuarios',
  USER_CREAR = '/usuarios/crear',
  USER_EDIT = '/usuarios/:id',
  ROLES = '/usuarios/roles',
  ROLE_FORM = '/usuarios/roles/crear',
  ROLE_EDIT = '/usuarios/roles/:id',
  PERMISSIONS = '/usuarios/permisos',
  PERMISSIONS_CREATE = '/usuarios/permisos/crear',
  PERMISSIONS_EDIT = '/usuarios/permisos/:id',

  // Sectors
  SECTORS = '/sectores',
  SECTOR_CREATE = '/sectores/crear',
  SECTOR_EDIT = '/sectores/:id',

  // Categories (nuevo)
  CATEGORIES = '/categorias',
  CATEGORY_CREATE = '/categorias/crear',
  CATEGORY_EDIT = '/categorias/:id',

  MODALITIES = '/modalidades',
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}
