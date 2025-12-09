export type SemaforoColor = 'GRIS' | 'VERDE' | 'AMARILLO' | 'NARANJA' | 'ROJO';
export type Tendencia = 'sin_datos' | 'estable' | 'mejorando' | 'empeorando';

export interface EstadoHidrico {
  semaforo: SemaforoColor;
  tendencia: Tendencia;
  valor_actual: number | null;
  umbral_min: number;
  umbral_max: number;
}

export interface IndiceRiesgoFungico {
  indice: number;
  descripcion: string;
  semaforo: SemaforoColor;
}

export interface CargaSalina {
  ce_actual: number | null;
  tendencia: Tendencia;
  umbral_max: number;
}

export interface Indicadores {
  estado_hidrico: EstadoHidrico;
  indice_riesgo_fungico: IndiceRiesgoFungico;
  carga_salina: CargaSalina;
  acciones_pendientes: string[];
}

export interface AlertItem {
  tipo: string;
  nivel: SemaforoColor;
  condicion: string;
  accion_recomendada: string;
}

export interface Alertas {
  ambientales: AlertItem[];
  humedad_suelo: AlertItem[];
  conductividad_electrica: AlertItem[];
}

export interface AlertsData {
  indicadores: Indicadores;
  alertas: Alertas;
}

export interface AlertsResponse {
  success: boolean;
  data: AlertsData;
  message?: string;
}
