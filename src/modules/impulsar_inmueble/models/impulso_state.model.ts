import { type ApiBase } from "@/models";
import { type ImpulsoStatus } from "./estadoImpulso.model";
import { type User } from "@/modules/users/models/user.model";
import { type State } from "@/modules/state/models/state.model";

export interface ImpulsarState extends ApiBase {
 startDate: string;
 endDate: string;
 status: ImpulsoStatus;
 razonAImpulsar: string;
 razonACancelar?: string;
 cancelled_at?: string;
 user: User;
 state: State;
}

export interface CreateImpulsarState extends Partial<Omit<ImpulsarState,'user'| 'state'| 'status'>>{
 startDate: string;
 endDate: string;
 razonAImpulsar: string;
 user: string;
 state: string;      
} 

export interface UpdateImpulsarState extends CreateImpulsarState {
  startDate: string;
  endDate: string;
  razonAImpulsar: string; 
}

export interface CancelarImpulsoState {
 id: string;   
 razonACancelar: string;  
}