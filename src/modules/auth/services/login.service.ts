import { STORAGE_BRANCH, STORAGE_TOKEN, STORAGE_USER, fetchData, getStorage, removeStorage, setStorage } from '@/utils'
import { type AuthLogin } from '../models/login.model'
import { AppConfig } from '@/config'

const userLogin = async (url: string, { arg }: { arg: AuthLogin }): Promise<any> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: { 'Content-Type': 'application/json' }
  }

  const data = await fetchData(url, options)
  if (data.data.accessToken) {
    setStorage(STORAGE_TOKEN, data.data.accessToken as string)
    setStorage(STORAGE_BRANCH, data.data.User.branch?.id as string)
  }
  return data.data.User
}

const checkToken = async (url: string, { arg }: { arg: { token: string } }): Promise<any> => {
  const response = await fetchData(`${url}?token=${arg.token}`)
  if (response.statusCode === 200) {
    setStorage(STORAGE_USER, response.data.id as string)
    setStorage(STORAGE_BRANCH, response.data.branch?.id as string)
  }
  return response.data
}

const userLogout = async (): Promise<any> => {
  try {
    const token = getStorage(STORAGE_TOKEN)
    if (!token) return true
    
    const options: RequestInit = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    
    await fetchData(`${AppConfig.API_URL}/api/auth/logout`, options)
    // Independientemente de la respuesta del servidor, limpiamos el almacenamiento local
    removeStorage(STORAGE_TOKEN)
    removeStorage(STORAGE_USER)
    removeStorage(STORAGE_BRANCH)
    return true
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Limpiamos de todas formas el almacenamiento local
    removeStorage(STORAGE_TOKEN)
    removeStorage(STORAGE_USER)
    removeStorage(STORAGE_BRANCH)
    return true
  }
}

export { userLogin, checkToken, userLogout }
