import { type ApiBase } from "@/models";
import { type ESTADO } from "./estado.model";
import { type User } from "@/modules/users/models/user.model";
import { type Ubicacion } from "./ubicacion.model";
import { type CreateUbicacion } from "./ubicacion.model";
import { type Sector } from "@/models/sector.model";
import { Category } from "@/models/category.model";
import { Modality } from "@/models/modality.model";
import { Imagen } from "./imagen.models";
import { Owner } from "@/models/owner.model";

export interface PropertyOwner extends ApiBase{
  owner: Owner;
}


export interface State extends ApiBase{
 descripcion:string
 precio: number
 estado: ESTADO
 area: number
 NroHabitaciones: number
 NroBanos: number
 NroEstacionamientos:number
 comision:number //<- recien se agrego
 condicion_Compra: string //<- recien se agrego
 user:User
 category:Category 
 modality:Modality 
 sector: Sector 
 ubicacion: Ubicacion
 imagenes: Imagen[]  //<- segun chatgpt esto debe traer las imagenes del inmueble 
 property_owner: PropertyOwner[]; // <- segun chat gpt esto debe traer los dueños del inmueble
 }

export interface CreateState extends Partial<Omit<State,'user'|'category'|'modality'|'sector'|'ubicacion'|'estado'>>{
 estado: ESTADO
 user: string
 category:string
 modality:string
 sector:string
 ubicacion:CreateUbicacion
}

export interface UpdateState extends CreateState{ }
