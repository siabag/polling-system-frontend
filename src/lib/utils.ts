import { AxiosError } from 'axios';

/**
 * Formatea la fecha a un formato legible
 */
export const formatDate = (date: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('es-ES', defaultOptions);
  } catch (error) {
    return 'Fecha inválida';
  }
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
 * Formatea fecha relativa (hace X tiempo)
 */
export const formatRelativeDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Hace menos de un minuto';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    return formatDate(date);
  }
};

/**
 * Extraer mensaje de error de Axios
 */
export const getErrorMessage = (error: unknown): string => {
  // Si es un error de Axios
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<any>;
    
    // Priorizar mensajes del backend
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    if (axiosError.response?.data?.error) {
      return typeof axiosError.response.data.error === 'string' 
        ? axiosError.response.data.error 
        : 'Error en la solicitud';
    }
    
    // Mensajes por código de estado HTTP
    if (axiosError.response?.status) {
      switch (axiosError.response.status) {
        case 400:
          return 'Datos inválidos. Por favor, revise la información ingresada.';
        case 401:
          return 'No autorizado. Sus credenciales han expirado.';
        case 403:
          return 'Acceso denegado. No tiene permisos para realizar esta acción.';
        case 404:
          return 'Recurso no encontrado.';
        case 409:
          return 'Conflicto. El recurso ya existe o está en uso.';
        case 422:
          return 'Error de validación. Algunos campos contienen datos inválidos.';
        case 429:
          return 'Demasiadas solicitudes. Intente nuevamente en unos minutos.';
        case 500:
          return 'Error interno del servidor. Intente nuevamente más tarde.';
        case 502:
          return 'Error de servidor. El servicio no está disponible temporalmente.';
        case 503:
          return 'Servicio no disponible. Intente nuevamente más tarde.';
        case 504:
          return 'Tiempo de espera agotado. Intente nuevamente.';
        default:
          return `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
      }
    }
    
    // Si hay mensaje en el error principal
    if (axiosError.message) {
      if (axiosError.message.includes('Network Error')) {
        return 'Error de conexión. Verifique su conexión a internet.';
      }
      if (axiosError.message.includes('timeout')) {
        return 'Tiempo de espera agotado. Intente nuevamente.';
      }
      return axiosError.message;
    }
  }
  
  // Si es un error estándar de JavaScript
  if (error instanceof Error) {
    return error.message;
  }
  
  // Si es un string
  if (typeof error === 'string') {
    return error;
  }
  
  // Si es un objeto con mensaje
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  
  // Fallback
  return 'Ha ocurrido un error inesperado. Intente nuevamente.';
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

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
export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

export const formatFullName = (firstName: string, lastName: string): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return 'Sin nombre';
  if (!first) return last;
  if (!last) return first;
  
  return `${first} ${last}`;
};

export const sanitizeString = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
/**
 * Comprobar si estamos en el lado del cliente
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
/**
 * Debounce function para optimizar búsquedas
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
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
 * Valida fortaleza de contraseña
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Debe tener al menos 8 caracteres');
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Debe contener al menos una letra mayúscula');
  }
  
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Debe contener al menos una letra minúscula');
  }
  
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Debe contener al menos un número');
  }
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Se recomienda incluir caracteres especiales');
  }
  
  return {
    isValid: score >= 4,
    score,
    feedback
  };
};