import { PrivateAxios } from '@/config/axios.config'
import { ENDPOINTS } from '@/utils/api.utils'
import { IBranch } from '../interfaces/branch.interface'
import { QueryParams } from '@/models/query.model'
import { PaginatedResponse } from '@/models/response.model'

export const branchService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<IBranch>> => {
    const response = await PrivateAxios.get(ENDPOINTS.BRANCH, { params })
    return response.data
  },

  getById: async (id: string): Promise<IBranch> => {
    const response = await PrivateAxios.get(`${ENDPOINTS.BRANCH}/${id}`)
    return response.data.data
  },

  create: async (branch: Partial<IBranch>): Promise<IBranch> => {
    const response = await PrivateAxios.post(ENDPOINTS.BRANCH, branch)
    return response.data.data
  },

  update: async (id: string, branch: Partial<IBranch>): Promise<IBranch> => {
    const response = await PrivateAxios.patch(`${ENDPOINTS.BRANCH}/${id}`, branch)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await PrivateAxios.delete(`${ENDPOINTS.BRANCH}/${id}`)
  }
} 