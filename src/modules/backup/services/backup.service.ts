import { BackupFile } from '../models/backup.model';

interface ResponseMessage {
  statusCode: number;
  data: any;
}

const fetchData = async (url: string, options?: RequestInit): Promise<ResponseMessage> => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Error en la petición');
  }

  return response.json();
};

const createManualBackup = async (url: string): Promise<ResponseMessage> => {
  const options: RequestInit = {
    method: 'POST',
  };
  return await fetchData(url, options);
};

const restoreBackup = async (
  url: string,
  { arg }: { arg: BackupFile }
): Promise<ResponseMessage> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg),
  };
  return await fetchData(`${url}/restore`, options);
};

const getAllBackups = async (url: string): Promise<ResponseMessage> => {
  const options: RequestInit = {
    method: 'GET',
  };
  return await fetchData(url, options);
};

export { createManualBackup, restoreBackup, getAllBackups };