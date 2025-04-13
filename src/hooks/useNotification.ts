import { useCallback } from 'react'

// Función simple en lugar de importar un módulo externo
const showToast = (title: string, message: string, isError = false) => {
  console.log(`${isError ? 'Error' : 'Éxito'}: ${title} - ${message}`)
  // En una implementación real, mostrarías una notificación
}

export const useNotification = () => {
  const showSuccess = useCallback((message: string) => {
    showToast('Éxito', message)
  }, [])

  const showError = useCallback((message: string) => {
    showToast('Error', message, true)
  }, [])

  return { showSuccess, showError }
} 