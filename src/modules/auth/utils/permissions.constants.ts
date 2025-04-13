export const PERMISSION_KEY = 'permissions'

export enum PERMISSION {
  // user
  USER = 'Usuario',
  USER_SHOW = 'Mostrar usuarios',
  ROLE = 'Rol',
  ROLE_SHOW = 'Mostrar roles',
  PERMISSION = 'Permiso',
  PERMISSION_SHOW = 'Mostrar permisos',
  // branch
  BRANCH = 'Sucursal',
  BRANCH_SHOW = 'Mostrar sucursales',
}

export const modulePermissions = {
  usuario: [
    PERMISSION.USER,
    PERMISSION.USER_SHOW,
    PERMISSION.ROLE,
    PERMISSION.ROLE_SHOW,
    PERMISSION.PERMISSION,
    PERMISSION.PERMISSION_SHOW
  ],
  sucursal: [
    PERMISSION.BRANCH,
    PERMISSION.BRANCH_SHOW
  ]
}
