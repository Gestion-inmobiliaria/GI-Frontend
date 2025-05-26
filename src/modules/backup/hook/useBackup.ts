import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { createManualBackup, restoreBackup, getAllBackups } from '../services/backup.service';
import { API_BASEURL, ENDPOINTS } from '@/utils';
import { type ResponseError } from '@/utils/response-error.utils';
import { type BackupFile } from '../models/backup.model';

interface ResponseMessage<T> {
  statusCode: number;
  data: T;
}

// 1. Crear backup manual
const useCreateBackup = () => {
  const { trigger, isMutating, error } = useSWRMutation<ResponseMessage<void>, ResponseError, string, void>(
    API_BASEURL + ENDPOINTS.BACKUP,
    async (url) => await createManualBackup(url)
  );

  return {
    createBackup: trigger,
    isCreatingBackup: isMutating,
    errorCreatingBackup: error,
  };
};

// 2. Restaurar backup
const useRestoreBackup = () => {
  const { trigger, isMutating, error } = useSWRMutation<ResponseMessage<void>, ResponseError, string, BackupFile>(
    API_BASEURL + ENDPOINTS.BACKUP,
    async (url, { arg }) => await restoreBackup(url, { arg })
  );

  return {
    restoreBackup: trigger,
    isRestoringBackup: isMutating,
    errorRestoringBackup: error,
  };
};

// 3. Obtener todos los backups
const useGetAllBackups = () => {
  const { data, error, isLoading, mutate } = useSWR<ResponseMessage<BackupFile[]>, ResponseError>(
    API_BASEURL + ENDPOINTS.BACKUP,
    getAllBackups
  );

  return {
    backups: data?.data ?? [],
    errorLoadingBackups: error,
    isLoadingBackups: isLoading,
    reloadBackups: mutate,
  };
};

export { useCreateBackup, useRestoreBackup, useGetAllBackups };