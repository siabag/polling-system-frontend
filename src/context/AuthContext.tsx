'use client'
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  AuthContextType, 
  AuthState, 
  AuthCredentials, 
  LoginResponse, 
  RegisterUserData,
  User
} from '../types/auth';
import { authApi } from '../lib/api';
import { getErrorMessage, setAuthToken, getAuthToken, removeAuthToken } from '../lib/utils';

// Definir el estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Crear el contexto
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  clearErrors: () => {},
});

// Tipos de acciones para el reducer
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User | undefined } }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer para manejar el estado
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log("Auth Reducer:", action.type, action);
  
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user || null,
        loading: false,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const loadUser = async () => {
      console.log("Loading user from token...");
      const token = getAuthToken();
      
      if (!token) {
        console.log("No token found");
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      console.log("Token found, verifying...");
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const response = await authApi.me();
        console.log("User loaded:", response.data);
        dispatch({ type: 'USER_LOADED', payload: response.data });
      } catch (error) {
        console.error("Error loading user:", error);
        removeAuthToken();
        dispatch({ type: 'AUTH_ERROR', payload: getErrorMessage(error) });
      }
    };
    
    loadUser();
  }, []);

  useEffect(() => {
    console.log("Auth state changed - isAuthenticated:", state.isAuthenticated);
    
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      console.log("Current path:", path);
      
      // Si estamos autenticados pero en una página de acceso público
      if (state.isAuthenticated && (path === '/login' || path === '/register')) {
        console.log("Authenticated user in public page, redirecting to dashboard");
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      }
    }
  }, [state.isAuthenticated, router]);

  // Función para iniciar sesión
  const login = async (credentials: AuthCredentials) => {
    console.log("Login attempt with:", credentials.email);
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authApi.login(credentials.email, credentials.password);
      console.log("Login successful:", response);
      
      const data = response.data as LoginResponse;
      
      setAuthToken(data.access_token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user } });
      
      // Redirigir explícitamente después del login
      console.log("Redirecting to dashboard after login");
      router.push('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      dispatch({ type: 'AUTH_ERROR', payload: getErrorMessage(error) });
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData: RegisterUserData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await authApi.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS' });
      
      // Redirigir a la página de login después del registro exitoso
      router.push('/login?registered=true');
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: getErrorMessage(error) });
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    console.log("Logging out");
    removeAuthToken();
    dispatch({ type: 'LOGOUT' });
    router.push('/login');
  };

  // Función para restablecer contraseña
  const resetPassword = async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await authApi.forgotPassword(email);
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Redirigir a una página de confirmación
      router.push('/reset-password/confirmation');
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: getErrorMessage(error) });
    }
  };

  // Función para limpiar errores
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Logging para debugging
  useEffect(() => {
    console.log("Auth state updated:", state);
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};