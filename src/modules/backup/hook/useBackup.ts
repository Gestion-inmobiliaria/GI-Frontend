import useSWRMutation from 'swr/mutation'
import { createManualBackup, restoreBackup, getAllBackups } from '../services/backup.service';
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import {BackupFile} from '../models/backup.model'
import useSWR from 'swr'

const useCreateBackup = () => {
  const { trigger, isMutating, error } = useSWRMutation<void, ResponseError, string, void>(
    API_BASEURL + ENDPOINTS.BACKUP,
    async (url) => {
      await createManualBackup(url);
    }
  );
  return { createBackup: trigger, isCreatingBackup: isMutating, error };
};

const useRestoreBackup = () => {
  const { trigger, isMutating, error } = useSWRMutation<void, ResponseError, string, BackupFile>(
    API_BASEURL + ENDPOINTS.BACKUP,
    async (url, { arg }) => {
      await restoreBackup(url, { arg });
    }
  );
  return { restoreBackup: trigger, isRestoringBackup: isMutating, error };
};

const useGetAllBackups = () => {
  const { data, error, isLoading, mutate } = useSWR<{ data: BackupFile[]; countData?: number }, ResponseError>(
    API_BASEURL + ENDPOINTS.BACKUP,
    getAllBackups
  );

  return {
    backups: data?.data ?? [],
    countBackups: data?.countData ?? 0,
    error,
    isLoading,
    mutate,
  };
};

export { useCreateBackup, useRestoreBackup, useGetAllBackups };