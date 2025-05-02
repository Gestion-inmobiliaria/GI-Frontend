/**
 * Obtiene el valor de una cookie por su nombre
 * @param name Nombre de la cookie
 * @returns Valor de la cookie o cadena vacía si no existe
 */
export const getCookie = (name: string): string => {
  try {
    const cookies = document.cookie.split(';')
    const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`))
    
    if (!cookie) {
      console.warn(`Cookie "${name}" no encontrada`)
      return ''
    }
    
    const cookieValue = cookie.split('=')[1]?.trim() || ''
    
    // Verificar token vacío
    if (name === 'token' && !cookieValue) {
      console.warn('Token vacío o inválido')
    }
    
    return cookieValue
  } catch (error) {
    console.error('Error al obtener cookie:', error)
    return ''
  }
}

/**
 * Establece una cookie con un nombre, valor y tiempo de expiración
 * @param name Nombre de la cookie
 * @param value Valor de la cookie
 * @param days Días de validez (por defecto 1)
 */
export const setCookie = (name: string, value: string, days = 1): void => {
  try {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value}; ${expires}; path=/`
  } catch (error) {
    console.error('Error al establecer cookie:', error)
  }
}

/**
 * Elimina una cookie por su nombre
 * @param name Nombre de la cookie
 */
export const removeCookie = (name: string): void => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  } catch (error) {
    console.error('Error al eliminar cookie:', error)
  }
}
