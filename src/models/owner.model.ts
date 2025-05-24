import { type ApiBase } from '@/models'

export interface Owner extends ApiBase {
  name: string
  ci: number
  email: string
  address: string
  phone: string
  isActive: boolean  
}
