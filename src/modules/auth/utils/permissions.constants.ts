export const PERMISSION_KEY = 'permissions'

export enum PERMISSION {
  // enum para los permisos
  // user
  USER = 'Usuario',
  USER_SHOW = 'Mostrar usuarios',
  ROLE = 'Rol',
  ROLE_SHOW = 'Mostrar roles',
  PERMISSION = 'Permiso',
  PERMISSION_SHOW = 'Mostrar permisos',

  // realstate
  REALSTATE = 'Inmobiliaria',
  REALSTATE_SHOW = 'Mostrar inmobiliarias',
  REALSTATE_CREATE = 'Crear inmobiliarias',
  REALSTATE_UPDATE = 'Actualizar inmobiliarias',
  REALSTATE_DELETE = 'Eliminar inmobiliarias',

  PROPERTY = 'Propiedad',
  PROPERTY_SHOW = 'Mostrar propiedades',
  PROPERTY_CREATE = 'Crear propiedades',
  PROPERTY_UPDATE = 'Actualizar propiedades',
  PROPERTY_DELETE = 'Eliminar propiedades',

  SECTOR = 'Sector',
  SECTOR_SHOW = 'Mostrar sectores',
  SECTOR_CREATE = 'Crear sectores',
  SECTOR_UPDATE = 'Actualizar sectores',
  SECTOR_DELETE = 'Eliminar sectores',

  SUBSCRIPTION = 'Suscripcion',
}

export const modulePermissions = {
  // modulePermissions se ocupa para mostrar los toogles
  usuario: [
    PERMISSION.USER,
    PERMISSION.USER_SHOW,
    PERMISSION.ROLE,
    PERMISSION.ROLE_SHOW,
    PERMISSION.PERMISSION,
    PERMISSION.PERMISSION_SHOW
  ],
  sector: [
    PERMISSION.SECTOR,
    PERMISSION.SECTOR_SHOW,
    PERMISSION.SECTOR_CREATE,
    PERMISSION.SECTOR_UPDATE,
    PERMISSION.SECTOR_DELETE
  ],
  realstate: [
    PERMISSION.REALSTATE,
    PERMISSION.REALSTATE_CREATE,
    PERMISSION.REALSTATE_DELETE,
    PERMISSION.REALSTATE_SHOW,
    PERMISSION.REALSTATE_UPDATE
  ]
}
