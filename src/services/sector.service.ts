import { API_URL } from '@/config/constants'
import { ApiResponse } from '@/models/api-response.model'
import { Sector } from '@/models/sector.model'
import { getStorage, STORAGE_TOKEN } from '@/utils'

const BASE_URL = `${API_URL}/api/sector`
const REALSTATE_URL = `${API_URL}/api/realstate`

// Función para depurar problemas de autorización
const debugAuth = () => {
  const token = getStorage(STORAGE_TOKEN)
  if (!token) {
    console.error('Error de autenticación: Token no encontrado')
    return false
  }
  console.log('Token encontrado:', token.substring(0, 10) + '...')
  return true
}

export const getSectors = async (params?: Record<string, any>): Promise<ApiResponse<Sector[]>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }
  
  // Asegurarse de incluir la relación con realState
  const queryParams = new URLSearchParams()
  
  // Añadir parámetros existentes
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value as string)
    })
  }
  
  const url = queryParams.toString() ? `${BASE_URL}?${queryParams.toString()}` : BASE_URL
  
  try {
    console.log('Llamando a API de sectores:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
      }
    })
    
    if (response.status === 401) {
      console.error('Error 401 (Unauthorized): Verifica que tengas los permisos necesarios')
      return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
    }
    
    const data = await response.json()
    console.log('Datos recibidos de sectores:', data)
    return data
  } catch (error) {
    console.error('Error en getSectors:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const getSector = async (id: string): Promise<ApiResponse<Sector>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }
  
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
      }
    })
    
    if (response.status === 401) {
      console.error('Error 401 (Unauthorized): Verifica que tengas los permisos necesarios')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error en getSector:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const createSector = async (sector: Omit<Sector, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Sector>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }
  
  try {
    console.log('Datos enviados al servidor:', JSON.stringify(sector))
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
      },
      body: JSON.stringify(sector)
    })
    
    if (!response.ok) {
      // Capturar y mostrar los errores HTTP
      const statusCode = response.status
      console.error(`Error ${statusCode} al crear sector:`, response.statusText)
      
      try {
        // Intentar leer cualquier mensaje de error del servidor
        const errorData = await response.json()
        console.error('Detalles del error:', errorData)
        return { 
          statusCode: statusCode, 
          error: response.statusText, 
          message: Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message || 'Error al crear el sector'
        }
      } catch (parseError) {
        return { 
          statusCode: statusCode, 
          error: response.statusText, 
          message: 'Error al crear el sector' 
        }
      }
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error en createSector:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const updateSector = async (id: string, sector: Partial<Sector>): Promise<ApiResponse<Sector>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }
  
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
      },
      body: JSON.stringify(sector)
    })
    
    if (response.status === 401) {
      console.error('Error 401 (Unauthorized): Verifica que tengas los permisos necesarios')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error en updateSector:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const deleteSector = async (id: string): Promise<ApiResponse<any>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }
  
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
      }
    })
    
    if (response.status === 401) {
      console.error('Error 401 (Unauthorized): Verifica que tengas los permisos necesarios')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error en deleteSector:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

// Servicio para obtener las inmobiliarias
export const getRealStates = async (params?: Record<string, any>): Promise<ApiResponse<any[]>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }
  
  const queryParams = params ? new URLSearchParams(params).toString() : ''
  const url = queryParams ? `${REALSTATE_URL}?${queryParams}` : REALSTATE_URL
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
      }
    })
    
    if (response.status === 401) {
      console.error('Error 401 (Unauthorized): Verifica que tengas los permisos necesarios')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error en getRealStates:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
} 