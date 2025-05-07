import { type ApiBase } from "@/models";
import { type ESTADO } from "./estado.model";
import { type User } from "@/modules/users/models/user.model";
import { type Ubicacion } from "./ubicacion.model";
import { type CreateUbicacion } from "./ubicacion.model";
import { type Sector } from "@/models/sector.model";

export interface State extends ApiBase{
 descripcion:string
 precio: number
 estado: ESTADO
 area: number
 NroHabitaciones?: number
 NroBanos?: number
 NroEstacionamientos?:number
 user:User
 category:string// Category reemplazar aqui cuando suban category 
 modality: string //Modality reemplazar aqui cuando suban modality
 sector: Sector 
 ubicacion: Ubicacion
}

export interface CreateState extends Partial<Omit<State,'user'|'category'|'modality'|'sector'|'ubicacion'|'estado'>>{
 estado: string 
 user: string
 category:string
 modality:string
 sector:string
 ubicacion:CreateUbicacion
}

export interface UpdateState extends CreateState{ }
