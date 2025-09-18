import axios, { AxiosError } from 'axios';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
      return Promise.reject(error);
    }

    // Mejorar manejo de errores
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.data?.error) {
      error.message = error.response.data.error;
    }

    return Promise.reject(error);
  }
);

// Interfaces para tipado
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
}

interface LoginCredentials {
  correo: string;
  contrasena: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId?: number;
}

interface UserFilters {
  rol?: string;
  activo?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  activo?: boolean;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
  activo?: boolean;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Servicios de autenticación
export const authApi = {
  login: async (correo: string, contrasena: string): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/api/auth/login', { correo, contrasena });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      const payload = {
        correo: userData.email,
        contrasena: userData.password,
        nombre: userData.firstName,
        apellido: userData.lastName,
        rol_id: userData.roleId,
      };
      const response = await api.post<ApiResponse>('/api/auth/register', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  forgotPassword: async (correo: string): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/api/auth/forgot-password', { correo });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (token: string, contrasena: string): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/api/auth/reset-password', { token, contrasena });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  me: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Servicios de usuario
export const userApi = {
  getAll: async (params?: UserFilters): Promise<ApiResponse> => {
    try {
      // Limpiar parámetros undefined
      const cleanParams = params ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      ) : {};
      
      const response = await api.get<ApiResponse>('/api/users', { params: cleanParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  create: async (userData: CreateUserData): Promise<ApiResponse> => {
    try {
      const payload = {
        nombre: userData.firstName,
        apellido: userData.lastName,
        correo: userData.email,
        contrasena: userData.password,
        rol_id: userData.roleId,
        activo: userData.activo ?? true,
      };
      const response = await api.post<ApiResponse>('/api/users', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id: number, userData: UpdateUserData): Promise<ApiResponse> => {
    try {
      const payload: any = {};
      
      if (userData.firstName) payload.nombre = userData.firstName;
      if (userData.lastName) payload.apellido = userData.lastName;
      if (userData.email) payload.correo = userData.email;
      if (userData.roleId) payload.rol_id = userData.roleId;
      if (userData.activo !== undefined) payload.activo = userData.activo;
      
      const response = await api.put<ApiResponse>(`/api/users/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  changePassword: async (id: number, passwordData: ChangePasswordData): Promise<ApiResponse> => {
    try {
      const payload = {
        contrasenaActual: passwordData.currentPassword,
        nuevaContrasena: passwordData.newPassword
      };
      const response = await api.post<ApiResponse>(`/api/users/${id}/change-password`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getRoles: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>('/api/auth/roles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Métodos adicionales útiles
  toggleUserStatus: async (id: number, activo: boolean): Promise<ApiResponse> => {
    try {
      const response = await api.patch<ApiResponse>(`/api/users/${id}/status`, { activo });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  bulkDelete: async (ids: number[]): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>('/api/users/bulk', { data: { ids } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  exportUsers: async (format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
    try {
      const response = await api.get(`/api/users/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Función helper para manejo de errores
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  } else if (error.message) {
    return error.message;
  } else if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Datos inválidos. Por favor, revise la información ingresada.';
      case 401:
        return 'No autorizado. Por favor, inicie sesión nuevamente.';
      case 403:
        return 'Acceso denegado. No tiene permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'Conflicto. El recurso ya existe.';
      case 422:
        return 'Error de validación. Revise los datos ingresados.';
      case 500:
        return 'Error interno del servidor. Intente nuevamente más tarde.';
      case 503:
        return 'Servicio no disponible. Intente nuevamente más tarde.';
      default:
        return 'Ha ocurrido un error inesperado. Intente nuevamente.';
    }
  } else {
    return 'Error de conexión. Verifique su conexión a internet.';
  }
};

// Función helper para validar respuestas
export const validateResponse = (response: ApiResponse): boolean => {
  return response && (response.success === true || response.error === false);
};

// Función helper para extraer datos de respuesta
export const extractResponseData = <T>(response: ApiResponse<T>): T | null => {
  if (validateResponse(response)) {
    return response.data || null;
  }
  return null;
};

export default api;