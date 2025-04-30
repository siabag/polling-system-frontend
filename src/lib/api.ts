import axios from 'axios';
import { mockApi } from './mockApi';

// Variable para controlar si usamos la API real o el mock
const USE_MOCK_API = true; // Cambiarlo a false cuando tengamos el backend real

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage (solo en el cliente)
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

    // Si el error es 401 (Unauthorized) y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Redirigir al usuario a la página de login si el token expiró
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login?expired=true';
      }
      return Promise.reject(error);
    }

    // Para otros errores, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

// Funciones de utilidad para endpoints comunes

// Wrapper para manejar la API real o el mock
const apiWrapper = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      if (USE_MOCK_API) {
        try {
          const response = await mockApi.login(email, password);
          return { data: response, status: 200 };
        } catch (error) {
          // Aquí es donde debemos preservar el mensaje original
          console.error("Error original en login mock:", error);
          
          // Crear un error de tipo AxiosError similar al que devolvería axios
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 401
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.post('/auth/login', { email, password });
    },
    
    register: async (userData: any) => {
      if (USE_MOCK_API) {
        try {
          await mockApi.register(userData);
          return { data: null, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.post('/auth/register', userData);
    },
    
    forgotPassword: async (email: string) => {
      if (USE_MOCK_API) {
        try {
          await mockApi.forgotPassword(email);
          return { data: null, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.post('/auth/forgot-password', { email });
    },
    
    resetPassword: async (token: string, password: string) => {
      if (USE_MOCK_API) {
        try {
          await mockApi.resetPassword(token, password);
          return { data: null, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.post('/auth/reset-password', { token, password });
    },
    
    me: async () => {
      if (USE_MOCK_API) {
        try {
          const user = await mockApi.me();
          return { data: user, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 401
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.get('/auth/me');
    },
    
    logout: async () => {
      if (USE_MOCK_API) {
        try {
          await mockApi.logout();
          return { data: null, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.post('/auth/logout');
    },
  },

  // User endpoints
  user: {
    getAll: async (params?: any) => {
      if (USE_MOCK_API) {
        try {
          const result = await mockApi.getAllUsers(params);
          return { data: result, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.get('/users', { params });
    },
    
    // Resto de métodos actualizados de manera similar...
    getById: async (id: number) => {
      if (USE_MOCK_API) {
        try {
          const user = await mockApi.getUserById(id);
          return { data: user, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 404
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.get(`/users/${id}`);
    },
    
    create: async (userData: any) => {
      if (USE_MOCK_API) {
        try {
          const newUser = await mockApi.createUser(userData);
          return { data: newUser, status: 201 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.post('/users', userData);
    },
    
    update: async (id: number, userData: any) => {
      if (USE_MOCK_API) {
        try {
          const updatedUser = await mockApi.updateUser(id, userData);
          return { data: updatedUser, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: error instanceof Error && error.message.includes('no encontrado') ? 404 : 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.put(`/users/${id}`, userData);
    },
    
    delete: async (id: number) => {
      if (USE_MOCK_API) {
        try {
          await mockApi.deleteUser(id);
          return { data: { success: true }, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 404
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.delete(`/users/${id}`);
    },
    
    changePassword: async (id: number, passwordData: any) => {
      if (USE_MOCK_API) {
        try {
          await mockApi.changeUserPassword(id, passwordData);
          return { data: { success: true }, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.post(`/users/${id}/change-password`, passwordData);
    },
    
    getRoles: async () => {
      if (USE_MOCK_API) {
        try {
          const roles = await mockApi.getRoles();
          return { data: roles, status: 200 };
        } catch (error) {
          const axiosLikeError = { 
            response: { 
              data: { 
                message: error instanceof Error ? error.message : 'Error desconocido' 
              },
              status: 400
            },
            isAxiosError: true,
            message: error instanceof Error ? error.message : 'Error desconocido'
          };
          
          return Promise.reject(axiosLikeError);
        }
      }
      return api.get('/roles');
    },
  }
};

export default api;
export const authApi = apiWrapper.auth;
export const userApi = apiWrapper.user;