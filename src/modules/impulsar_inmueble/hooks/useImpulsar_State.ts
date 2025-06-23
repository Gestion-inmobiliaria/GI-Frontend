import useSWRMutation from 'swr/mutation'
import {createImpulso, getAllImpulso, getImpulso, updateImpulso, cancelarImpulso, deleteImpulso} from "@modules/impulsar_inmueble/services/impulsar_inmueble.service";
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type ImpulsarState, type CreateImpulsarState, type UpdateImpulsarState, type CancelarImpulsoState } from "../models/impulso_state.model";
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

// crear impulso
const useCreateImpulso = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateImpulsarState>(
    API_BASEURL + ENDPOINTS.IMPULSO,
    createImpulso
  )
  return { createImpulso: trigger, isMutating, error }
}

// obtener impulso por id
const useGetImpulso = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<ImpulsarState, ResponseError>(
    id ? API_BASEURL + ENDPOINTS.IMPULSO + `/${id}` : null,
    getImpulso
  )
  return { impulso: data, isLoading, error, isValidating }
}

// Obtener todos los impulsos (con filtros/paginación)
const useGetAllImpulsos = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } =
    useFilterData(filterStateDefault)
  const { data, error, isLoading,isValidating, mutate } = useSWR<ApiResponse, ResponseError>(
    `${API_BASEURL + ENDPOINTS.IMPULSO}?${queryParams}`,
    getAllImpulso,
     {
      refreshInterval: 2 * 60 * 1000, // 🕐 cada 5 minutos
      revalidateOnFocus: true,        // opcional: vuelve a pedir datos si el usuario regresa a la pestaña
    }
  )
  return {
    allImpulsos: data?.data ?? [],
    countData: data?.countData ?? 0,
    error,
    isLoading,
    isValidating,
    mutate,
    changeOrder,
    filterOptions,
    newPage,
    prevPage,
    search,
    setFilterOptions,
    setOffset
  }
}

// Actualizar impulso
const useUpdateImpulso = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateImpulsarState>(
    API_BASEURL + ENDPOINTS.IMPULSO,
    updateImpulso
  )
  return { updateImpulso: trigger, isMutating, error }
}

// Cancelar impulso
const useCancelarImpulso = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CancelarImpulsoState>(
    API_BASEURL + ENDPOINTS.IMPULSO,
    cancelarImpulso
  )
  return { cancelarImpulso: trigger, isMutating, error }
}

// Eliminar impulso
const useDeleteImpulso = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, string>(
    API_BASEURL + ENDPOINTS.IMPULSO,
    deleteImpulso
  )
  return { deleteImpulso: trigger, isMutating, error }
}

export {useCreateImpulso, useGetImpulso, useGetAllImpulsos, useUpdateImpulso, useCancelarImpulso, useDeleteImpulso }