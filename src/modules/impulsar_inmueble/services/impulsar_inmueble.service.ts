import { fetchData } from "@/utils";
import { type ImpulsarState ,type CreateImpulsarState , type UpdateImpulsarState, type CancelarImpulsoState } from "../models/impulso_state.model";
import { type ApiResponse } from "@/models";

const createImpulso = async (url: string, { arg }: { arg: CreateImpulsarState }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getImpulso = async (url: string): Promise<ImpulsarState> => {
  const response = await fetchData(url)
  const mappedData: ImpulsarState = {
    ...response.data,
    state: response.data.property, // mapeamos aquí
  }
  return mappedData
}

const getAllImpulso = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  const mappedData = (response.data as any[]).map(item => ({
    ...item,
    state: item.property, // mapeamos property → state
  }))
  return { data: mappedData as ImpulsarState[], countData: response.countData }
}

const updateImpulso = async (url: string, { arg }: { arg: UpdateImpulsarState }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      startDate: arg.startDate,
      endDate: arg.endDate,
      razonAImpulsar: arg.razonAImpulsar,
    })
  }
  await fetchData(`${url}/${arg.id}`, options)
}

const cancelarImpulso = async (url: string, { arg }: { arg: CancelarImpulsoState }): Promise<void> => {
  const { id, razonACancelar } = arg;
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify({ razonACancelar }),
  };
  await fetchData(`${url}/${id}/cancelar`, options);
};

const deleteImpulso = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}/${id}`, options)
}

export {createImpulso, getAllImpulso, getImpulso, updateImpulso, cancelarImpulso, deleteImpulso};