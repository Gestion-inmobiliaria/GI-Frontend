export interface Property {
  id: string
  descripcion: string
  precio: string
  area: string
  estado: string
  NroHabitaciones: number
  NroBanos: number
  NroEstacionamientos: number
  
  ubicacion: {
    id: string
    direccion: string
    pais: string
    ciudad: string
    latitud: string
    longitud: string
  }

  sector: {
    id: string
    name: string
  }

  category: {
    id: string
    name: string
  }

  modality: {
    id: string
    name: string
  }
  imagenes: Imagen[]  
}
export interface Imagen {
  id: string
  url: string
  descripcion?: string
}
