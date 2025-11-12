// src/lib/apiDataTTH.ts
import { DataTTHParams, DataTTHResponse, MonthlySummaryParams, MonthlySummaryResponse } from '../types/dataTTH';
import api from './api';


// Función para obtener datos de temperatura y humedad
export const dataTTHApi = {
  getData: async (params?: DataTTHParams): Promise<DataTTHResponse> => {
    try {
      // Limpiar parámetros undefined
      const cleanParams = params ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      ) : {};
      
      const response = await api.get<DataTTHResponse>('/api/data_tth', { 
        params: cleanParams 
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportData: async (params?: DataTTHParams, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
    try {
      const cleanParams = params ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      ) : {};

      // Backend expone /api/data_tth/csv; ignoramos 'format' y usamos CSV.
      const response = await api.get(`/api/data_tth/csv`, {
        params: cleanParams,
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resumen mensual: temperatura y humedad
  getMonthlySummary: async (params?: MonthlySummaryParams): Promise<MonthlySummaryResponse> => {
    try {
      const cleanParams = params ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      ) : {};

      const response = await api.get<MonthlySummaryResponse>('/api/data_tth/monthly_summary', {
        params: cleanParams,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};