import useSWRMutation from 'swr/mutation'
import {createState, getAllState, getState, updateState, deleteState} from "../services/state.service";
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type State, type CreateState, type UpdateState } from "../models/state.model";
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateState = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateState>(API_BASEURL + ENDPOINTS.PROPERTY, createState)
  return { createState: trigger, isMutating, error }
}

const useGetState = (id?: string) => {
    const { data, isLoading, error, isValidating } = useSWR<State, ResponseError>(id ? API_BASEURL + ENDPOINTS.PROPERTY + `/${id}` : null, getState)
    return { state: data, isLoading, error, isValidating }
  }
    
const useGetAllState=() => {
 const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
 const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.PROPERTY}?${queryParams}`, getAllState)
 return { allStates: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useUpdateState= () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateState>(API_BASEURL + ENDPOINTS.PROPERTY, updateState)
  return { updateState: trigger, isMutating, error }
}

const useDeleteState= () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(API_BASEURL + ENDPOINTS.PROPERTY, deleteState)
  return { deleteState: trigger, error, isMutating }
}

export{useCreateState,useGetState, useGetAllState, useUpdateState,useDeleteState}