import { Role, User } from './auth';

export interface UserListResponse {
  users: User[];
  total: number;
}

export interface UserFilters {
  search?: string;
  roleId?: number;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
  active?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UsersContextType {
  users: User[];
  totalUsers: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  getUsers: (filters?: UserFilters) => Promise<void>;
  getUserById: (id: number) => Promise<User | null>;
  createUser: (userData: CreateUserData) => Promise<User | null>;
  updateUser: (id: number, userData: UpdateUserData) => Promise<User | null>;
  changeUserPassword: (id: number, passwordData: ChangePasswordData) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  clearErrors: () => void;
}