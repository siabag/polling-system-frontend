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
    firstName: 'Admin',
    lastName: 'Sistema',
    email: 'admin@sistema.com',
    role: mockRoles[0],
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@ejemplo.com',
    role: mockRoles[1],
    active: true,
    createdAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    firstName: 'María',
    lastName: 'López',
    email: 'maria@ejemplo.com',
    role: mockRoles[2],
    active: true,
    createdAt: '2023-01-03T00:00:00Z',
  },
  {
    id: 4,
    firstName: 'Carlos',
    lastName: 'González',
    email: 'carlos@ejemplo.com',
    role: mockRoles[1],
    active: false,
    createdAt: '2023-01-04T00:00:00Z',
  },
];

// Credenciales válidas para pruebas
export const validCredentials: { [email: string]: string } = {
  'admin@sistema.com': 'Admin123',
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

// Buscar usuario por email
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Buscar usuario por ID
export const findUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Verificar credenciales
export const verifyCredentials = (email: string, password: string): boolean => {
  return validCredentials[email] === password;
};

// Crear nuevo usuario
export const createUser = (userData: CreateUserData): User => {
  const role = mockRoles.find(role => role.id === userData.roleId);
  
  if (!role) {
    throw new Error('Rol no válido');
  }
  
  const newUser: User = {
    id: nextUserId++,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: role,
    active: userData.active !== undefined ? userData.active : true,
    createdAt: new Date().toISOString(),
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
  let updatedRole = user.role;
  
  // Actualizar rol si es necesario
  if (userData.roleId) {
    const role = mockRoles.find(role => role.id === userData.roleId);
    if (role) {
      updatedRole = role;
    }
  }
  
  // Actualizar usuario
  const updatedUser: User = {
    ...user,
    firstName: userData.firstName || user.firstName,
    lastName: userData.lastName || user.lastName,
    email: userData.email || user.email,
    role: updatedRole,
    active: userData.active !== undefined ? userData.active : user.active,
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
    filteredUsers = filteredUsers.filter(user => user.role.id === Number(filters.roleId));
  }
  
  // Filtrar por estado
  if (filters?.active !== undefined) {
    const active = filters.active === 'true' || filters.active === true;
    filteredUsers = filteredUsers.filter(user => user.active === active);
  }
  
  // Filtrar por búsqueda
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      user => 
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
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