export interface DataPoint {
  fecha_hora: string;
  valor: number;
}

export interface DataTTHGrouped {
  temperatura_ambiente: DataPoint[];
  humedad_ambiente: DataPoint[];
  temperatura_suelo: DataPoint[];
  humedad_suelo: DataPoint[];
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