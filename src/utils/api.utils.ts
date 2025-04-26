import { AppConfig } from '../config'



export const ENDPOINTS = {
  // auth
  AUTH: '/api/auth',
  // user
  USER: '/api/user',
  ROLE: '/api/role',
  PERMISSION: '/api/permission',
  // branch
  BRANCH: '/api/branch',
  // client
  CLIENT: '/api/client'
}

export const API_BASEURL = AppConfig.API_URL
