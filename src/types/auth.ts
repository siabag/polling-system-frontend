export interface AuthCredentials {
    email: string;
    password: string;
  }
  
  export interface ResetPasswordRequest {
    email: string;
  }
  
  export interface NewPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface AuthContextType extends AuthState {
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (userData: RegisterUserData) => Promise<void>;
    logout: () => void;
    resetPassword: (email: string) => Promise<void>;
    clearErrors: () => void;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface RegisterUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: number;
  }

  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    active: boolean;
    createdAt: string;
  }
  
  export interface Role {
    id: number;
    name: string;
    description: string;
  }