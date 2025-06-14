// src/types/survey.ts

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena_hash?: string; // Solo para creación, no se devuelve en respuestas
  activo: boolean;
  rol_id: number;
  rol?: Rol;
  created_at?: string;
  updated_at?: string;
}

export interface Finca {
  id: number;
  nombre: string;
  ubicacion: string;
  latitud: number | string | null;
  longitud: number | string | null;
  propietario: string;
  usuario_id: number;
  usuario?: Usuario;
  created_at?: string | undefined;
  updated_at?: string;
}

export interface TipoEncuesta {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Factor {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  activo: boolean;
  tipo_encuesta_id: number;
  tipo_encuesta?: TipoEncuesta;
  valores_posibles?: ValorPosible[];
  created_at?: string;
  updated_at?: string;
}

export interface ValorPosible {
  id: number;
  factor_id: number;
  valor: string;
  codigo: number;
  descripcion: string;
  activo: boolean;
  factor?: Factor;
  created_at?: string;
  updated_at?: string;
}

export interface Encuesta {
  id: number;
  fecha_aplicacion: string;
  tipo_encuesta_id: number;
  usuario_id: number;
  finca_id: number;
  observaciones: string;
  completada: boolean;
  tipo_encuesta?: TipoEncuesta;
  usuario?: Usuario;
  finca?: Finca;
  respuestas?: RespuestaFactor[];
  created_at?: string;
  updated_at?: string;
}

export interface RespuestaFactor {
  id: number;
  encuesta_id: number;
  factor_id: number;
  valor_posible_id: number;
  respuesta_texto: string;
  factor?: Factor;
  valor_posible?: ValorPosible;
  created_at?: string;
  updated_at?: string;
}

// Tipos para la creación/actualización
export interface CreateEncuestaData {
  fecha_aplicacion: string;
  tipo_encuesta_id: number;
  finca_id: number;
  observaciones: string;
  respuestas: {
    factor_id: number;
    valor_posible_id: number;
    respuesta_texto: string;
  }[];
}

export interface UpdateEncuestaData {
  fecha_aplicacion?: string;
  observaciones?: string;
  completada?: boolean;
  respuestas?: {
    factor_id: number;
    valor_posible_id: number;
    respuesta_texto: string;
  }[];
}

export interface CreateFactorData {
  nombre: string;
  descripcion: string;
  categoria: string;
  tipo_encuesta_id: number;
  valores_posibles: {
    valor: string;
    codigo: number;
    descripcion: string;
  }[];
}

export interface UpdateFactorData {
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  activo?: boolean;
  valores_posibles?: {
    id?: number;
    valor: string;
    codigo: number;
    descripcion: string;
    activo?: boolean;
  }[];
}

export interface CreateUsuarioData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol_id: number;
}

export interface UpdateUsuarioData {
  nombre?: string;
  apellido?: string;
  correo?: string;
  contrasena?: string;
  activo?: boolean;
  rol_id?: number;
}

export interface CreateFincaData {
  nombre: string;
  ubicacion: string;
  latitud?: number | null;
  longitud?: number| null;
  propietario: string;
}

export interface UpdateFincaData {
  nombre?: string;
  ubicacion?: string;
  latitud?: number | null;
  longitud?: number | null;
  propietario?: string;
}

// Tipos para filtros
export interface EncuestaFilters {
  tipo_encuesta_id?: number;
  finca_id?: number;
  usuario_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  completada?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FactorFilters {
  tipo_encuesta_id?: number;
  categoria?: string;
  activo?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FincaFilters {
  usuario_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UsuarioFilters {
  rol_id?: number;
  activo?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// Tipo para respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}