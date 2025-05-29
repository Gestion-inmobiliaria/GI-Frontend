import { type ApiBase } from '@/models'
import { Sector } from '@/models/sector.model'
import { type Role } from '@/modules/auth/models/role.model'
import { type GENDER } from '@/utils'

export interface User extends ApiBase {
  name: string
  ci: number
  email: string
  address: string
  phone: string
  gender: GENDER
  isActive: boolean
  role: Role
  password: string
  sector?: Sector 
}
export interface CreateUser extends Partial<Omit<User, 'role' | 'branch' | 'gender'>> {
  gender: string
  role: string
  branch?: string
}

export interface UpdateUser extends CreateUser { }
