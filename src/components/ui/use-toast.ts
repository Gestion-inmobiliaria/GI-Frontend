// Implementación básica de toast
interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const toast = (props: ToastProps) => {
  console.log(`Toast: ${props.title} - ${props.description}`)
  // En una implementación real, esto mostraría una notificación en pantalla
} 