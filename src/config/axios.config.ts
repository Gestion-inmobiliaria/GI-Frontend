import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios'
import { API_BASEURL } from '@/utils/api.utils'

export const PrivateAxios = axios.create({
  baseURL: API_BASEURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token
PrivateAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
) 