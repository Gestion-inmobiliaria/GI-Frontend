import { PrivateAxios } from '@/config/axios.config'
import { ENDPOINTS } from '@/utils/api.utils'
import { IClient } from '../interfaces/client.interface'
import { QueryParams } from '@/models/query.model'
import { PaginatedResponse } from '@/models/response.model'



export const clientService = {
    getAll: async (params?: QueryParams): Promise<PaginatedResponse<IClient>> => {
      const response = await PrivateAxios.get(ENDPOINTS.CLIENT, { params })
      return response.data
    },
  
    getById: async (id: string): Promise<IClient> => {
      const response = await PrivateAxios.get(`${ENDPOINTS.CLIENT}/${id}`)
      return response.data.data
    },
  
    create: async (client: Partial<IClient>): Promise<IClient> => {
      const response = await PrivateAxios.post(ENDPOINTS.CLIENT, client)
      return response.data.data
    },
  
    update: async (id: string, client: Partial<IClient>): Promise<IClient> => {
      const response = await PrivateAxios.patch(`${ENDPOINTS.CLIENT}/${id}`, client)
      return response.data.data
    },
  
    delete: async (id: string): Promise<void> => {
      await PrivateAxios.delete(`${ENDPOINTS.CLIENT}/${id}`)
    }
}
