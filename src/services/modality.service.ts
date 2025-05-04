import { API_URL } from '@/config/constants'
import { ApiResponse } from '@/models/api-response.model'
import { Modality } from '@/models/modality.model'
import { getStorage, STORAGE_TOKEN } from '@/utils'

const BASE_URL = `${API_URL}/api/modalities`

export const getModalities = async (): Promise<ApiResponse<Modality[]>> => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`,
        'Content-Type': 'application/json',
      },
    })
    return await response.json()
  } catch (error) {
    console.error('Error al obtener modalidades:', error)
    return { statusCode: 500, error: 'Error interno', message: 'No se pudieron cargar las modalidades' }
  }
}
