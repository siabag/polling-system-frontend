export interface DataPoint {
  fecha_hora: string;
  valor: number;
}

export interface DataTTHGrouped {
  temperatura_ambiente: DataPoint[];
  humedad_ambiente: DataPoint[];
  temperatura_suelo: DataPoint[];
  humedad_suelo: DataPoint[];
  conductividad_suelo: DataPoint[];
}

export interface DataTTHResponse {
  success: boolean;
  data: DataTTHGrouped;
  total_registros: number;
  rango_fechas: {
    inicio: string;
    fin: string;
  };
  message: string;
}

export interface DataTTHParams {
  start_date?: string; // Formato: YYYY-MM-DD
  end_date?: string;   // Formato: YYYY-MM-DD
}

// Tipos para el resumen mensual
export interface MonthlySummaryItem {
  mes: string;
  temperatura_promedio: number;
  temperatura_max: number;
  temperatura_min: number;
  humedad_promedio: number;
  humedad_max: number;
  humedad_min: number;
  n: number;
  indice: number;
}

export interface MonthlySummaryNota {
  mes: string;
  valor: number;
  unidad: string;
}

export interface MonthlySummaryData {
  notas: {
    mes_mas_caluroso?: MonthlySummaryNota;
    mes_mas_humedo?: MonthlySummaryNota;
    mes_menos_propicio?: MonthlySummaryNota;
  };
  summary: MonthlySummaryItem[];
}

export interface MonthlySummaryResponse {
  success: boolean;
  data: MonthlySummaryData;
  message: string;
}