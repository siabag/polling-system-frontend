import { User, Role } from '../types/auth';
import { CreateUserData, UpdateUserData } from '../types/user';

// Roles simulados
export const mockRoles: Role[] = [
  { id: 1, name: 'administrador', description: 'Acceso completo al sistema' },
  { id: 2, name: 'encuestador', description: 'Puede crear y ver sus propias encuestas' },
  { id: 3, name: 'analista', description: 'Puede ver todas las encuestas y generar reportes' },
];

// Usuarios simulados
export const mockUsers: User[] = [
  {
    id: 1,
    nombre: 'Admin',
    apellido: 'Sistema',
    correo: 'admin@sistema.com',
    rol: mockRoles[0].name,
    activo: true
  },
  {
    id: 2,
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan@ejemplo.com',
    rol: mockRoles[1].name,
    activo: true
  },
  {
    id: 3,
    nombre: 'María',
    apellido: 'López',
    correo: 'maria@ejemplo.com',
    rol: mockRoles[2].name,
    activo: true
  },
  {
    id: 4,
    nombre: 'Carlos',
    apellido: 'González',
    correo: 'carlos@ejemplo.com',
    rol: mockRoles[1].name,
    activo: true
  },
];

// Credenciales válidas para pruebas
export const validCredentials: { [correo: string]: string } = {
  'admin@sistema.com': 'admin123',
  'juan@ejemplo.com': 'Juan123',
  'maria@ejemplo.com': 'Maria123',
  'carlos@ejemplo.com': 'Carlos123',
};

// Función para generar token simple (en producción usarías JWT)
export const generateToken = (userId: number): string => {
  return `mock-token-${userId}-${Date.now()}`;
};

// Contador para nuevos IDs
let nextUserId = mockUsers.length + 1;

// Funciones auxiliares para manipular los datos

// Buscar usuario por correo
export const findUserBycorreo = (correo: string): User | undefined => {
  return mockUsers.find(user => user.correo === correo);
};

// Buscar usuario por ID
export const findUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Verificar credenciales
export const verifyCredentials = (correo: string, password: string): boolean => {
  return validCredentials[correo] === password;
};

// Crear nuevo usuario
export const createUser = (userData: CreateUserData): User => {
  const role = mockRoles.find(role => role.id === userData.roleId);
  
  if (!role) {
    throw new Error('Rol no válido');
  }
  
  const newUser: User = {
    id: nextUserId++,
    nombre: userData.firstName,
    apellido: userData.lastName,
    correo: userData.email,
    rol: role.name,
    activo: true
  };
  
  // Agregar a la lista de usuarios
  mockUsers.push(newUser);
  
  // Agregar credenciales
  validCredentials[userData.email] = userData.password;
  
  return newUser;
};

// Actualizar usuario existente
export const updateUser = (id: number, userData: UpdateUserData): User | null => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  const user = mockUsers[userIndex];
  let updatedRole = user.rol;
  
  // Actualizar rol si es necesario
  if (userData.roleId) {
    const role = mockRoles.find(role => role.id === userData.roleId);
    if (role) {
      updatedRole = role.name;
    }
  }
  
  // Actualizar usuario
  const updatedUser: User = {
    ...user,
    nombre: userData.firstName || user.nombre,
    apellido: userData.lastName || user.apellido,
    correo: userData.email || user.correo,
    rol: updatedRole,
    activo: user.activo ?? true
  };
  
  // Reemplazar en la lista
  mockUsers[userIndex] = updatedUser;
  
  return updatedUser;
};

// Eliminar usuario
export const deleteUser = (id: number): boolean => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return false;
  }
  
  mockUsers.splice(userIndex, 1);
  return true;
};

// Obtener usuarios con filtros
export const getUsers = (filters?: any) => {
  // Filtrar por rol
  let filteredUsers = [...mockUsers];
  
  if (filters?.roleId) {
    filteredUsers = filteredUsers.filter(user => user.rol === filters.roleId);
  }
  
  
  // Filtrar por búsqueda
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      user => 
        user.nombre.toLowerCase().includes(search) ||
        user.apellido.toLowerCase().includes(search) ||
        user.correo.toLowerCase().includes(search)
    );
  }
  
  // Calcular total
  const total = filteredUsers.length;
  
  // Paginar resultados
  const page = Number(filters?.page) || 1;
  const limit = Number(filters?.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return {
    users: paginatedUsers,
    total,
  };
};