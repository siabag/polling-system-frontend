import { AxiosError } from 'axios';

/**
 * Formatea la fecha a un formato legible
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Formatea la fecha y hora a un formato legible
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Extraer mensaje de error de Axios
 */
export const getErrorMessage = (error: unknown): string => {
  console.log("Error original recibido:", error);
  
  // Si es un error de Axios
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    console.log("Error de tipo Axios detectado");
    // Extraer mensaje de error de la respuesta de la API
    const axiosError = error as AxiosError<{message?: string, error?: string}>;
    
    console.log("Response data:", axiosError.response?.data);
    
    // Priorizar el mensaje que viene en data.message
    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      const data = axiosError.response.data;
      if ('message' in data && data.message) {
        return data.message as string;
      }
      if ('error' in data && data.error) {
        return data.error as string;
      }
    }
    
    // Si no hay data.message, usar el mensaje general del error
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  // Si es un Error estándar
  if (error instanceof Error) {
    console.log("Error estándar detectado:", error.message);
    return error.message;
  }
  
  // Cualquier otro tipo de error
  console.log("Error de tipo desconocido");
  return 'Ha ocurrido un error desconocido';
}

/**
 * Validar si un correo electrónico tiene formato válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Comprobar si un valor es un objeto válido
 */
export const isObject = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Truncar texto si excede cierta longitud
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Obtener iniciales de un nombre completo
 */
export const getInitials = (name: string): string => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

/**
 * Comprobar si estamos en el lado del cliente
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Guardar token en localStorage
 */
export const setAuthToken = (token: string): void => {
  if (isClient()) {
    localStorage.setItem('token', token);
  }
};

/**
 * Obtener token de localStorage
 */
export const getAuthToken = (): string | null => {
  if (isClient()) {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Eliminar token de localStorage
 */
export const removeAuthToken = (): void => {
  if (isClient()) {
    localStorage.removeItem('token');
  }
};

/**
 * Calcular número total de páginas basado en total de elementos y límite por página
 */
export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};

/**
 * Validar fuerza de contraseña
 * Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número
 */
export const isStrongPassword = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return minLength && hasUpperCase && hasLowerCase && hasNumbers;
};