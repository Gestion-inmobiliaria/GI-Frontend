import { useCreateBackup, useGetAllBackups, useRestoreBackup } from '@/modules/backup/hook/useBackup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

const BackupPage = () => {
  const { createBackup, isCreatingBackup } = useCreateBackup();
  const { backups, errorLoadingBackups, isLoadingBackups, reloadBackups } = useGetAllBackups();
  const { restoreBackup, isRestoringBackup } = useRestoreBackup();

  const [searchTerm, setSearchTerm] = useState('');
  const [restoringFile, setRestoringFile] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    try {
      await createBackup();
      toast.success('Respaldo creado exitosamente');
      await reloadBackups();
    } catch (err) {
      toast.error('Error al crear el respaldo');
      console.error('Error al crear el backup', err);
    }
  };

  const handleRestore = async (fileName: string) => {
    try {
      setRestoringFile(fileName);
      await restoreBackup({ fileName });
      toast.success(`"${fileName}" restaurado con éxito`);
      await reloadBackups();
    } catch (err) {
      toast.error('Error al restaurar respaldo');
      console.error('Error al restaurar el backup', err);
    } finally {
      setRestoringFile(null);
    }
  };

  const filteredBackups = useMemo(() => {
    if (!searchTerm) return backups;
    return backups.filter((backup) =>
      backup.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [backups, searchTerm]);

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Gestión de Backups</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <Button
          onClick={handleCreateBackup}
          disabled={isCreatingBackup}
          className="w-full sm:w-auto"
        >
          {isCreatingBackup ? 'Creando respaldo...' : 'Crear respaldo manual'}
        </Button>

        <Input
          placeholder="Buscar respaldo por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80"
        />
      </div>

      <h2 className="text-lg sm:text-xl font-semibold mb-3">Respaldos disponibles</h2>

      {isLoadingBackups ? (
        <p>Cargando respaldos...</p>
      ) : errorLoadingBackups ? (
        <p className="text-red-600">Error al cargar respaldos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Nombre del archivo</th>
                <th className="border px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBackups.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    No se encontraron respaldos.
                  </td>
                </tr>
              ) : (
                filteredBackups.map((backup) => (
                  <tr key={backup.fileName}>
                    <td className="border px-4 py-2 break-words max-w-xs">{backup.fileName}</td>
                    <td className="border px-4 py-2">
                      <Button
                        variant="outline"
                        onClick={() => handleRestore(backup.fileName)}
                        disabled={isRestoringBackup || restoringFile === backup.fileName}
                      >
                        {restoringFile === backup.fileName ? 'Restaurando...' : 'Restaurar'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {(isCreatingBackup || restoringFile) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-11/12 max-w-sm">
            <p className="mb-4 text-base sm:text-lg font-semibold text-gray-800">
              {isCreatingBackup
                ? 'Creando copia de seguridad...'
                : `Restaurando "${restoringFile}"...`}
            </p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupPage;