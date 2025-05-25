import { useCreateBackup, useGetAllBackups, useRestoreBackup } from '@/modules/backup/hook/useBackup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'

 console.log('esto es una prueba para ver si funciona o no');
const BackupPage = () => {
  const { createBackup, isCreatingBackup } = useCreateBackup()
  const { backups, isLoading, mutate } = useGetAllBackups()
  const { restoreBackup, isRestoringBackup } = useRestoreBackup()
 
  const [searchTerm, setSearchTerm] = useState('')
  const [restoringFile, setRestoringFile] = useState<string | null>(null)

  const handleCreateBackup = async () => {
    try {
      await createBackup()
      await mutate()
    } catch (err) {
      console.error('Error al crear el backup', err)
    }
  }

  const handleRestore = async (fileName: string) => {
    try {
      setRestoringFile(fileName)
      await restoreBackup({ fileName })
    } catch (err) {
      console.error('Error al restaurar el backup', err)
    } finally {
      setRestoringFile(null)
    }
  }

  const filteredBackups = useMemo(() => {
    return backups.filter((backup) =>
      backup.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [backups, searchTerm])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Backups</h1>

      <div className="flex items-center gap-4 mb-4">
        <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
          {isCreatingBackup ? 'Creando respaldo...' : 'Crear respaldo manual'}
        </Button>

        <Input
          placeholder="Buscar respaldo por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Respaldos disponibles</h2>

      {isLoading ? (
        <p>Cargando respaldos...</p>
      ) : (
        <table className="min-w-full border mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nombre del archivo</th>
              <th className="border px-4 py-2">Acciones</th>
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
                  <td className="border px-4 py-2">{backup.fileName}</td>
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
      )}
    </div>
  );
}

export default BackupPage