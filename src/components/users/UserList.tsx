import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { UserFilters } from '../../types/user';
import { User } from '../../types/auth'
import useUsers from '../../hooks/useUsers';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface UserListProps {
  initialFilters?: UserFilters;
}

const UserList: React.FC<UserListProps> = ({ initialFilters = { page: 1, limit: 10 } }) => {
  const router = useRouter();
  const { 
    users, 
    totalUsers, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    getUsers, 
    deleteUser,
    clearErrors 
  } = useUsers();
  
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    getUsers(filters);
  }, [getUsers, filters]);

  // Mostrar errores
  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertType('error');
      setShowAlert(true);
    }
  }, [error]);

  // Actualizar filtros cuando cambia la página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  // Confirmar eliminación de usuario
  const handleConfirmDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Ejecutar eliminación de usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    const success = await deleteUser(userToDelete.id);
    
    if (success) {
      setAlertType('success');
      setAlertMessage(`Usuario ${userToDelete.nombre} ${userToDelete.apellido} eliminado correctamente`);
      setShowAlert(true);
    }
    
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  // Cerrar alerta
  const handleCloseAlert = () => {
    setShowAlert(false);
    clearErrors();
  };

  // Cerrar confirmación de eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={handleCloseAlert}
          className="mb-4"
        />
      )}

      <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Usuarios del sistema</h3>
          <p className="mt-1 text-sm text-gray-500">
            Total: {totalUsers} usuarios
          </p>
        </div>
        <Link href="/users/new">
          <Button className="flex items-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            Nuevo usuario
          </Button>
        </Link>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo electrónico
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-sm text-center text-gray-500">
                  Cargando usuarios...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-sm text-center text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
                        {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.nombre} {user.apellido}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.correo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.rol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/users/${user.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleConfirmDelete(user)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * filters.limit! + 1}</span> a <span className="font-medium">
                  {Math.min(currentPage * filters.limit!, totalUsers)}
                </span> de <span className="font-medium">{totalUsers}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Eliminar usuario
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Está seguro que desea eliminar al usuario {userToDelete.nombre} {userToDelete.apellido}? Esta acción no puede deshacerse.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="danger"
                  className="w-full sm:ml-3 sm:w-auto"
                  onClick={handleDeleteUser}
                >
                  Eliminar
                </Button>
                <Button
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={handleCancelDelete}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;