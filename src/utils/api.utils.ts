import { AppConfig } from '../config'

export const ENDPOINTS = {
  // auth
  AUTH: '/api/auth',
  // plan
  PLAN: '/api/plan',
  REALSTATE: '/api/realstate',
  // user
  USER: '/api/user',
  ROLE: '/api/role',
  PERMISSION: '/api/permission',

  // property
  PROPERTY: '/api/property',
  // ubicacion
  UBICACION: '/api/ubicacion'
}

export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
