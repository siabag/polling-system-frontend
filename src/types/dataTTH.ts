export interface DataPoint {
  fecha_hora: string;
  valor: number;
}

export interface DataTTHGrouped {
  temperatura_ambiente: DataPoint[];
  humedad_ambiente: DataPoint[];
  temperatura_suelo: DataPoint[];
  humedad_suelo: DataPoint[];
  conductividad_suelo?: DataPoint[]; // opcional según datos disponibles
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

// ===== Resumen mensual (Temperatura y Humedad) =====
export interface MonthlySummaryItem {
  mes: string; // "Septiembre de 2024"
  temperatura_promedio: number;
  temperatura_max: number;
  temperatura_min: number;
  humedad_promedio: number;
  humedad_max: number;
  humedad_min: number;
  n: number; // conteo de registros
  indice: number; // (temperatura_promedio + humedad_promedio) / 2
}

export interface MonthlySummaryNotes {
  mes_mas_caluroso: { mes: string; valor: number; unidad: string };
  mes_mas_humedo: { mes: string; valor: number; unidad: string };
  mes_menos_propicio: { mes: string; valor: number; unidad: string };
}

export interface MonthlySummaryData {
  notas: MonthlySummaryNotes;
  summary: MonthlySummaryItem[];
}

export interface MonthlySummaryResponse {
  success: boolean;
  data: MonthlySummaryData;
  message: string;
}

export interface MonthlySummaryParams {
  start_date?: string; // YYYY-MM-DD (opcional)
  end_date?: string;   // YYYY-MM-DD (opcional)
}