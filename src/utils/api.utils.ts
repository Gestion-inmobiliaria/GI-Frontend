import { AppConfig } from '../config'

export const ENDPOINTS = {
  // auth
  AUTH: '/api/auth',
  RESET_PASSWORD: '/api/reset-password',
  RECOVER_PASSWORD: '/api/forgot-password',
  // user
  ROLE: '/api/role',
  PERMISSION: '/api/permission',
  // company
  COMPANY: '/api/company',
  BRANCH: '/api/branch'
}

export const API_BASEURL = AppConfig.API_URL
