export interface Sector {
  id: string
  name: string
  adress?: string
  phone?: string
  realState?: { // esta ocupando este
    id: string
    name: string
  }
  realStateId?: string
  createdAt: string
  updatedAt: string
} 