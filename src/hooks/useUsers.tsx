import { useState, useCallback } from 'react';
import { 
  CreateUserData, 
  UpdateUserData, 
  ChangePasswordData,
  UserFilters
} from '../types/user';
import { userApi } from '../lib/api';
import { getErrorMessage } from '../lib/utils';
import { User } from '../types/auth';

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
  const getUsers = useCallback(async (filters?: UserFilters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getAll(filters);
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
      
      // Calcular total de páginas
      const limit = filters?.limit || 10;
      setTotalPages(Math.ceil(response.data.total / limit));
      setCurrentPage(filters?.page || 1);

      return response.data.users;
    } catch (error) {
      setError(getErrorMessage(error));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener un usuario por su ID
   */
  const getUserById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getById(id);
      return response.data;
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear un nuevo usuario
   */
  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.create(userData);
      
      // Actualizar la lista de usuarios si ya existe
      if (users.length > 0) {
        setUsers(prevUsers => [...prevUsers, response.data]);
        setTotalUsers(prevTotal => prevTotal + 1);
      }

      return response.data;
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    } finally {
      setLoading(false);
    }
  }, [users]);

  /**
   * Actualizar un usuario existente
   */
  const updateUser = useCallback(async (id: number, userData: UpdateUserData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.update(id, userData);
      
      // Actualizar la lista de usuarios
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, ...response.data } : user
        )
      );

      return response.data;
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cambiar la contraseña de un usuario
   */
  const changeUserPassword = useCallback(async (id: number, passwordData: ChangePasswordData) => {
    try {
      setLoading(true);
      setError(null);

      await userApi.changePassword(id, passwordData);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar un usuario
   */
  const deleteUser = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      await userApi.delete(id);
      
      // Actualizar la lista de usuarios
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setTotalUsers(prevTotal => prevTotal - 1);
      
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
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

  return {
    users,
    totalUsers,
    loading,
    error,
    currentPage,
    totalPages,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    clearErrors,
  };
};

export default useUsers;