import { LoginResponse, AuthCredentials } from '../types/auth';
import { CreateUserData, UpdateUserData, ChangePasswordData, UserFilters } from '../types/user';
import { 
  mockUsers, 
  mockRoles,
  findUserBycorreo,
  findUserById, 
  verifyCredentials, 
  generateToken, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUsers 
} from './mockData';

// Función para simular delay de red
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Clase con métodos mock que simulan llamadas a la API
export class MockApi {
  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay();
    
    const user = findUserBycorreo(email);
    console.log("mock api - login");
    console.log("mock api - user:",user);

    
    if (!user || !verifyCredentials(email, password)) {
      throw new Error('Credenciales incorrectas');
    }
    
    if (!user) {
      throw new Error('Usuario inactivo. Contacte al administrador.');
    }
    
    const token = generateToken(user.id);
    
    return {
      access_token: token,
      user,
    };
  }
  
  async forgotPassword(email: string): Promise<void> {
    await delay();
    
    const user = findUserBycorreo(email);
    
    if (!user) {
      // Por seguridad, no informamos si el correo existe o no
      return;
    }
    
    // En un entorno real, aquí enviarías un email con un token
    console.log(`[MOCK] Se enviaría un email a ${email} con un token de recuperación`);
  }
  
  async resetPassword(token: string, password: string): Promise<void> {
    await delay();
    
    // Simulamos validación de token (en realidad no hacemos nada con él)
    if (!token || token.length < 10) {
      throw new Error('Token inválido o expirado');
    }
    
    // En un entorno real, aquí buscarías al usuario por el token y cambiarías su contraseña
    console.log(`[MOCK] Se cambiaría la contraseña asociada al token ${token}`);
  }
  
  async me(): Promise<any> {
    await delay();
    
    // En un entorno real, decodificarías el token para obtener el ID del usuario
    // Aquí usamos el primer usuario como ejemplo
    const user = mockUsers[0];
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  }
  
  async logout(): Promise<void> {
    await delay();
    // En un backend real, podrías invalidar el token
    // Aquí no hay que hacer nada especial
  }
  
  // User endpoints
  async getAllUsers(params?: UserFilters): Promise<any> {
    await delay();
    
    return getUsers(params);
  }
  
  async getUserById(id: number): Promise<any> {
    await delay();
    
    const user = findUserById(id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  }
  
  async createUser(userData: CreateUserData): Promise<any> {
    await delay();
    
    const existingUser = findUserBycorreo(userData.email);
    
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }
    
    const newUser = createUser(userData);
    return newUser;
  }
  
  async updateUser(id: number, userData: UpdateUserData): Promise<any> {
    await delay();
    
    // Verificar si estamos actualizando el email y ya existe
    if (userData.email) {
      const existingUser = findUserBycorreo(userData.email);
      
      if (existingUser && existingUser.id !== id) {
        throw new Error('El correo electrónico ya está registrado por otro usuario');
      }
    }
    
    const updatedUser = updateUser(id, userData);
    
    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }
    
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<any> {
    await delay();
    
    const success = deleteUser(id);
    
    if (!success) {
      throw new Error('Usuario no encontrado');
    }
    
    return { success: true };
  }
  
  async changeUserPassword(id: number, passwordData: ChangePasswordData): Promise<any> {
    await delay();
    
    const user = findUserById(id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // En un entorno real, verificarías la contraseña actual
    // y actualizarías a la nueva
    console.log(`[MOCK] Se cambiaría la contraseña del usuario ${id}`);
    
    return { success: true };
  }
  
  async getRoles(): Promise<any> {
    await delay();
    
    return mockRoles;
  }
}

// Instancia singleton para usar en toda la aplicación
export const mockApi = new MockApi();