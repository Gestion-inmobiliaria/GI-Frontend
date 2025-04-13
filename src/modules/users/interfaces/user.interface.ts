import { IBase } from '@/models/base.model'
import { IBranch } from '@/modules/branches/interfaces/branch.interface'

export interface IUser extends IBase {
  ci: number
  name: string
  email: string
  phone?: string
  gender: string
  isActive: boolean
  branch?: IBranch
} 