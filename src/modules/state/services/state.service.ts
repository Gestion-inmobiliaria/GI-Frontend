import { fetchData } from "@/utils";
import { type State, type CreateState, type UpdateState } from "../models/state.model";
import { type ApiResponse } from "@/models";


const createState = async (url: string, { arg }: { arg: CreateState }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      descripcion: arg.descripcion,
      precio: arg.precio,
      estado: arg.estado,
      area: arg.area,
      NroHabitaciones: arg.NroHabitaciones,
      NroBanos: arg.NroBanos,
      NroEstacionamientos: arg.NroEstacionamientos,
      comision: arg.comision,
      condicion_Compra: arg.condicion_Compra, // Corregir el nombre del campo
      user: arg.user,
      category: arg.category,
      modality: arg.modality,
      sector: arg.sector,
      ubicacion: {
        direccion: arg.ubicacion.direccion,
        pais: arg.ubicacion.pais,
        ciudad: arg.ubicacion.ciudad,
        latitud: arg.ubicacion.latitud,
        longitud: arg.ubicacion.longitud
      }
    })
  }
  const response = await fetchData(url, options)
  return response
}

const getState = async (url: string): Promise<State> => {
  const response = await fetchData(url)
  return response.data
}

const getAllState = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as State[], countData: response.countData }
}

const updateState = async (url: string, { arg }: { arg: UpdateState }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      descripcion: arg?.descripcion,
      precio: arg?.precio,
      estado: arg?.estado,
      area: arg?.area,
      NroHabitaciones: arg?.NroHabitaciones,
      NroBanos: arg?.NroBanos,
      NroEstacionamientos: arg?.NroEstacionamientos,
      comision: arg?.comision,
      condicion_Compra: arg?.condicion_Compra, // Corregir el nombre del campo
      user: arg?.user,
      category: arg?.category,
      modality: arg?.modality,
      sector: arg?.sector,
      ubicacion: {
        direccion: arg?.ubicacion?.direccion,
        pais: arg?.ubicacion?.pais,
        ciudad: arg?.ubicacion?.ciudad,
        latitud: arg?.ubicacion?.latitud,
        longitud: arg?.ubicacion?.longitud
      }
    })
  }
  await fetchData(`${url}/${arg.id}`, options)
}


const deleteState = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}/${id}`, options)
}

export { createState, getAllState, getState, updateState, deleteState}