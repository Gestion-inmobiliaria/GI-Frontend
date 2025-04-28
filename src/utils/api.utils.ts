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
    UPLOAD_EXCEL: '/api/states/upload-excel',
}

export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
    return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
