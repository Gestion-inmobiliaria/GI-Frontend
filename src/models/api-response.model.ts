export interface ApiResponse<T = any> {
  statusCode?: number
  message?: string | string[]
  error?: string
  data?: T
  countData?: number
}
