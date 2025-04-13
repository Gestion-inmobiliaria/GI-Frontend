import { PrivateAxios } from '@/config/axios.config'
import { ENDPOINTS } from '@/utils/api.utils'
import { PaginatedResponse } from '@/models/response.model'
import { type Permission, type PermissionUpdate } from '../models/permission.model'
import { QueryParams } from '@/models/query.model'

export const permissionService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Permission>> => {
    const response = await PrivateAxios.get(ENDPOINTS.PERMISSION, { params })
    return response.data
  },

  getById: async (id: string): Promise<Permission> => {
    const response = await PrivateAxios.get(`${ENDPOINTS.PERMISSION}/${id}`)
    return response.data.data
  },

  create: async (permission: PermissionUpdate): Promise<Permission> => {
    const response = await PrivateAxios.post(ENDPOINTS.PERMISSION, permission)
    return response.data.data
  },

  update: async (id: string, permission: PermissionUpdate): Promise<Permission> => {
    const response = await PrivateAxios.patch(`${ENDPOINTS.PERMISSION}/${id}`, permission)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await PrivateAxios.delete(`${ENDPOINTS.PERMISSION}/${id}`)
  },

  // Método para agregar los permisos de sucursales
  addBranchPermissions: async (): Promise<any> => {
    try {
      // Crear permiso para gestionar sucursales
      const branchPermission = await permissionService.create({
        name: 'Sucursal',
        description: 'permite gestionar sucursales',
        type: 'Sucursales' // Este valor debe coincidir con el enum PermissionType.BRANCH
      })
      
      // Crear permiso para ver sucursales
      const branchShowPermission = await permissionService.create({
        name: 'Mostrar sucursales',
        description: 'permite ver sucursales',
        type: 'Sucursales' // Este valor debe coincidir con el enum PermissionType.BRANCH
      })
      
      return {
        branchPermission,
        branchShowPermission,
        message: 'Permisos de sucursales creados correctamente'
      }
    } catch (error) {
      console.error('Error al crear permisos de sucursales:', error)
      throw error
    }
  }
}

export default permissionService 