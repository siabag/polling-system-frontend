import axios from 'axios';
import { mockApi } from './mockApi';

// Variable para controlar si usamos la API real o el mock
const USE_MOCK_API = false; // Cambiarlo a false cuando tengamos el backend real

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
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
        window.location.href = '/login?expired=true';
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);


// Wrapper para manejar la API real o el mock
const apiWrapper = {
  // Auth endpoints
  auth: {
    login: async (correo: string, contrasena: string) => {
      if (USE_MOCK_API) {
        try {
          const response = await mockApi.login(correo, contrasena);
          return { data: response, status: 200 };
        } catch (error) {
          console.error("Error original en login mock:", error);
          
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
      const response = await api.post('/api/auth/login', { correo, contrasena });      
      return response.data;
    },
    
    register: async (userData: any) => {
      // Adaptar los nombres de campos para el registro si es necesario
      const payload = {
        correo: userData.email,
        contrasena: userData.password,
        nombre: userData.firstName,
        apellido: userData.lastName,
        ...userData
      };
      
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
      const response = await api.post('/api/auth/register', payload);
      return response.data;
    },
    
    forgotPassword: async (correo: string) => {
      if (USE_MOCK_API) {
        try {
          await mockApi.forgotPassword(correo);
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
      return api.post('api/auth/forgot-password', { correo });
    },
    
    resetPassword: async (token: string, contrasena: string) => {
      if (USE_MOCK_API) {
        try {
          await mockApi.resetPassword(token, contrasena);
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
      const response = await api.post('/reset-password', { token, contrasena });
      return response.data;
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
      const response = await api.get('/api/auth/me');
      return response.data;
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
      const response = await api.post('/api/auth/logout');
      return response.data;
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
      const response = await api.get('/users', { params });
      return response.data;
    },
    
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
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    
    create: async (userData: any) => {
      // Adaptar los nombres de campos si es necesario
      const payload = {
        correo: userData.email,
        contrasena: userData.password,
        ...userData
      };
      
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
      const response = await api.post('/users', payload);
      return response.data;
    },
    
    update: async (id: number, userData: any) => {
      // Adaptar los nombres de campos si es necesario
      const payload = {
        correo: userData.email,
        ...userData
      };
      
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
      const response = await api.put(`/users/${id}`, payload);
      return response.data;
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
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    
    changePassword: async (id: number, passwordData: any) => {
      // Adaptar los nombres de campos para el cambio de contraseña
      const payload = {
        contrasenaActual: passwordData.currentPassword,
        nuevaContrasena: passwordData.newPassword
      };
      
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
      const response = await api.post(`/users/${id}/change-password`, payload);
      return response.data;
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
      const response = await api.get('/roles');
      return response.data;
    },
  }
};

export default api;
export const authApi = apiWrapper.auth;
export const userApi = apiWrapper.user;