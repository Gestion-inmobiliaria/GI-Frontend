import { type ApiResponse, getAllResource } from '@/services/crud.service'
import { type Log, type LogListParams } from '../models/log.model'
import { AppConfig } from '@/config'
import { STORAGE_TOKEN, getStorage } from '@/utils'

const LOG_BASE_URL = `${AppConfig.API_URL}/api/logs`

export const getLogs = async (params: LogListParams = {}): Promise<ApiResponse<Log[]>> => {
  // Debug: Verificar si hay un token disponible
  const token = getStorage(STORAGE_TOKEN)
  console.log('Token disponible para auth:', !!token)

  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.search) queryParams.append('search', params.search)
  if (params.fromDate) queryParams.append('fromDate', params.fromDate)
  if (params.toDate) queryParams.append('toDate', params.toDate)

  const queryString = queryParams.toString()
  const url = `${LOG_BASE_URL}${queryString ? `?${queryString}` : ''}`

  return await getAllResource<Log>(url)
}
