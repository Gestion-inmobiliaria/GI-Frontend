import { API_URL } from '@/config/constants'
import { ApiResponse } from '@/models/api-response.model'
import { Property } from '@/models/property.model'
import { getStorage, STORAGE_TOKEN } from '@/utils'
const BASE_URL = `${API_URL}/api/property`
const BASE_SECTOR_URL = `${API_URL}/api/sector`
const BASE_MODALITY_URL = `${API_URL}/api/modalities`
const debugAuth = () => {
    const token = getStorage(STORAGE_TOKEN)
    if (!token) {
        return false
    }
    return true
}


export const getSectors = async (): Promise<ApiResponse<{ id: string, name: string }[]>> => {
    if (!debugAuth()) {
        return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
    }

    try {
        const response = await fetch(BASE_SECTOR_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
            }
        })

        if (response.status === 401) {
            return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
        }

        const data = await response.json()
        return data
    } catch (error) {
        return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
    }
}

export const getModalities = async (): Promise<ApiResponse<{ id: string, name: string }[]>> => {
    if (!debugAuth()) {
        return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
    }

    try {
        const response = await fetch(BASE_MODALITY_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
            }
        })

        if (response.status === 401) {
            return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
        }

        const data = await response.json()
        return data
    } catch (error) {
        return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
    }
}

export const getProperties = async (): Promise<ApiResponse<Property[]>> => {
    if (!debugAuth()) {
        return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
    }

    try {
        const response = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getStorage(STORAGE_TOKEN)}`
            }
        })

        if (response.status === 401) {

            return { statusCode: 401, error: 'Unauthorized', message: 'No autorizado' }
        }

        const data = await response.json()

        return data
    } catch (error) {

        return { statusCode: 500, error: 'Internal Server Error', message: 'Error interno del servidor' }
    }
}
