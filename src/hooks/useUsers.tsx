import { useState, useCallback } from 'react';
import { userApi } from '../lib/api';
import { getErrorMessage } from '../lib/utils';

// Tipos
export interface User {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  activo: boolean;
  rol: string;
  fechaCreacion?: string;
  ultimaActividad?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  activo?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
  activo?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  rol?: string;
  activo?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Hook personalizado para la gestión de usuarios
 */
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  /**
   * Obtener listado de usuarios con filtros opcionales
   */
  const getUsers = useCallback(async (filters?: UserFilters): Promise<User[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getAll(filters);
      
      // Manejo flexible de la respuesta del backend
      const data = response.data || response;
      const usersList = data.users || data || [];
      const total = data.total || usersList.length;
      
      setUsers(usersList);
      setTotalUsers(total);
      
      // Calcular total de páginas
      const limit = filters?.limit || 10;
      setTotalPages(Math.ceil(total / limit));
      setCurrentPage(filters?.page || 1);

      return usersList;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      setUsers([]);
      setTotalUsers(0);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener un usuario por su ID
   */
  const getUserById = useCallback(async (id: number): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getById(id);
      const userData = response.data || response;
      
      return userData;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear un nuevo usuario
   */
  const createUser = useCallback(async (userData: CreateUserData): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.create(userData);
      const newUser = response.data || response;
      
      // Actualizar la lista de usuarios si ya existe
      if (users.length > 0) {
        setUsers(prevUsers => [newUser, ...prevUsers]);
        setTotalUsers(prevTotal => prevTotal + 1);
      }

      return newUser;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [users]);

  /**
   * Actualizar un usuario existente
   */
  const updateUser = useCallback(async (id: number, userData: UpdateUserData): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.update(id, userData);
      const updatedUser = response.data || response;
      
      // Actualizar la lista de usuarios
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );

      return updatedUser;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cambiar la contraseña de un usuario
   */
  const changeUserPassword = useCallback(async (id: number, passwordData: ChangePasswordData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await userApi.changePassword(id, passwordData);
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar un usuario
   */
  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await userApi.delete(id);
      
      // Actualizar la lista de usuarios
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setTotalUsers(prevTotal => prevTotal - 1);
      
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener roles disponibles
   */
  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getRoles();
      return response.data || response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpiar errores
   */
  const clearErrors = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resetear estado
   */
  const resetState = useCallback(() => {
    setUsers([]);
    setTotalUsers(0);
    setCurrentPage(1);
    setTotalPages(1);
    setError(null);
    setLoading(false);
  }, []);

  return {
    // Estado
    users,
    totalUsers,
    loading,
    error,
    currentPage,
    totalPages,
    
    // Métodos
    getUsers,
    getUserById,
    createUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    getRoles,
    clearErrors,
    resetState,
  };
};

export default useUsers;