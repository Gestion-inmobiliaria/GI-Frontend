import { IBase } from '@/models/base.model'

export interface IBranch extends IBase {
  name: string
  address: string
  phone?: string
  email?: string
  description?: string
  isActive: boolean
  users?: string[] // Solo guardaremos los IDs de los usuarios
} 