import { API_URL } from '@/config/constants'
import { ApiResponse } from '@/models/api-response.model'
import { Category } from '@/models/category.model'
import { getStorage, STORAGE_TOKEN } from '@/utils'

const BASE_URL = `${API_URL}/api/categories`

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

export const getCategories = async (
  params?: Record<string, any>
): Promise<ApiResponse<Category[]>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }

  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value as string)
    })
  }

  const url = queryParams.toString() ? `${BASE_URL}?${queryParams}` : BASE_URL

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStorage(STORAGE_TOKEN)}`,
      },
    })

    if (response.status === 401) {
      console.error('Error 401 (Unauthorized): Verifica que tengas los permisos necesarios')
      return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en getCategories:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const getCategory = async (id: string): Promise<ApiResponse<Category>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStorage(STORAGE_TOKEN)}`,
      },
    })

    if (response.status === 401) {
      console.error('Error 401 (Unauthorized)')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en getCategory:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Category>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStorage(STORAGE_TOKEN)}`,
      },
      body: JSON.stringify(category),
    })

    if (!response.ok) {
      const statusCode = response.status
      console.error(`Error ${statusCode} al crear categoría:`, response.statusText)

      try {
        const errorData = await response.json()
        return {
          statusCode,
          error: response.statusText,
          message: Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message || 'Error al crear la categoría',
        }
      } catch {
        return {
          statusCode,
          error: response.statusText,
          message: 'Error al crear la categoría',
        }
      }
    }

    return await response.json()
  } catch (error) {
    console.error('Error en createCategory:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<ApiResponse<Category>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStorage(STORAGE_TOKEN)}`,
      },
      body: JSON.stringify(category),
    })

    if (response.status === 401) {
      console.error('Error 401 (Unauthorized)')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en updateCategory:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}

export const deleteCategory = async (id: string): Promise<ApiResponse<any>> => {
  if (!debugAuth()) {
    return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
  }

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStorage(STORAGE_TOKEN)}`,
      },
    })

    if (response.status === 401) {
      console.error('Error 401 (Unauthorized)')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en deleteCategory:', error)
    return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
  }
}
