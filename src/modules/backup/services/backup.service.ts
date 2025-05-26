import { BackupFile } from '../models/backup.model';

export interface ResponseMessage<T = any> {
  statusCode: number;
  data: T;
}

/**
 * Función genérica para hacer peticiones fetch con tipado y manejo de errores.
 */
const fetchData = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ResponseMessage<T>> => {
  const token = localStorage.getItem('token') // o donde estés guardando tu JWT

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los datos');
  }

  const data = await response.json();
  return data;
};


/**
 * Ejecuta un respaldo manual.
 */
const createManualBackup = async (url: string): Promise<ResponseMessage<void>> => {
  return await fetchData<void>(url, { method: 'POST' });
};

/**
 * Restaura un respaldo dado un archivo.
 */
const restoreBackup = async (
  url: string,
  { arg }: { arg: BackupFile }
): Promise<ResponseMessage<void>> => {
  return await fetchData<void>(`${url}/restore`, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
};

/**
 * Obtiene todos los respaldos disponibles.
 */
const getAllBackups = async (url: string): Promise<ResponseMessage<BackupFile[]>> => {
  return await fetchData<BackupFile[]>(url, { method: 'GET' });
};

export { createManualBackup, restoreBackup, getAllBackups };