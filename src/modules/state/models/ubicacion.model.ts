import { ApiBase } from "@/models";

export interface Ubicacion extends ApiBase{
 direccion: string;
 pais: string;
 ciudad: string;
 latitud: number;
 longitud: number;
}
export interface CreateUbicacion extends Partial<Omit<Ubicacion,'createdAt' | 'updatedAt'>>{
}
export interface UpdateUbicacion extends CreateUbicacion{ }
