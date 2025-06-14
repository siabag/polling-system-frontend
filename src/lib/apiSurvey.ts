// src/lib/api/survey.ts

import api from './api';
import { surveyMockApi } from './surveyMockApi';
import {
  CreateEncuestaData,
  UpdateEncuestaData,
  CreateFactorData,
  UpdateFactorData,
  CreateFincaData,
  UpdateFincaData,
  EncuestaFilters,
  FactorFilters,
  FincaFilters
} from '../types/survey';

const USE_MOCK_API = false; // Cambiar a false cuando tengas el backend real

const surveyApiWrapper = {
  // Tipos de encuesta
  async getTiposEncuesta() {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getTiposEncuesta();
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get('/api/tipos-encuesta');
    return response.data;
  },

  async getTipoEncuestaById(id: number) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getTipoEncuestaById(id);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 404
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get(`/api/tipos-encuesta/${id}`);
    return response.data;
  },

  // Factores
  async getFactores(params?: FactorFilters) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getFactores(params);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get('/api/factors', { params });
    return response;
  },

  async getFactorById(id: number) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getFactorById(id);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 404
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get(`/api/factors/${id}`);
    return response.data;
  },

  async createFactor(data: CreateFactorData) {
    if (USE_MOCK_API) {
      try {
        const newFactor = await surveyMockApi.createFactor(data);
        return { data: newFactor, status: 201 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.post('/api/factors', data);
    return response.data;
  },

  async updateFactor(id: number, data: UpdateFactorData) {
    if (USE_MOCK_API) {
      try {
        const updatedFactor = await surveyMockApi.updateFactor(id, data);
        return { data: updatedFactor, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.put(`/api/factors/${id}`, data);
    return response.data;
  },

  // Fincas
  async getFincas(params?: FincaFilters) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getFincas(params);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get('/api/fincas', { params });
    return response.data;
  },

  async getFincaById(id: number) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getFincaById(id);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 404
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get(`/api/fincas/${id}`);
    return response.data;
  },

  async createFinca(data: CreateFincaData) {
    if (USE_MOCK_API) {
      try {
        const newFinca = await surveyMockApi.createFinca(data);
        return { data: newFinca, status: 201 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.post('/api/fincas', data);
    return response.data;
  },

  async updateFinca(id: number, data: UpdateFincaData) {
    if (USE_MOCK_API) {
      try {
        const updatedFinca = await surveyMockApi.updateFinca(id, data);
        return { data: updatedFinca, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.put(`/api/fincas/${id}`, data);
    return response.data;
  },

  async deleteFinca(id: number) {
    const response = await api.delete(`/api/fincas/${id}`);
    return response.data;
  },

  // Encuestas
  async getEncuestas(params?: EncuestaFilters) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getEncuestas(params);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get('/api/encuestas', { params });
    return response;
  },

  async getEncuestaById(id: number) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getEncuestaById(id);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 404
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get(`/api/encuestas/${id}`);
    return response.data;
  },

  async createEncuesta(data: CreateEncuestaData, usuarioId: number) {
    if (USE_MOCK_API) {
      try {
        const newEncuesta = await surveyMockApi.createEncuesta(data, usuarioId);
        return { data: newEncuesta, status: 201 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.post('/api/encuestas', data);
    return response.data;
  },

  async updateEncuesta(id: number, data: UpdateEncuestaData, usuarioId: number) {
    if (USE_MOCK_API) {
      try {
        const updatedEncuesta = await surveyMockApi.updateEncuesta(id, data, usuarioId);
        return { data: updatedEncuesta, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.put(`/api/encuestas/${id}`, data);
    return response.data;
  },

  async deleteEncuesta(id: number, usuarioId: number) {
    if (USE_MOCK_API) {
      try {
        const result = await surveyMockApi.deleteEncuesta(id, usuarioId);
        return { data: result, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.delete(`/api/encuestas/${id}`);
    return response.data;
  },

  // Métodos auxiliares
  async getFactoresConValoresByTipoEncuesta(tipoEncuestaId: number) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getFactoresConValoresByTipoEncuesta(tipoEncuestaId);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get(`/api/tipos-encuesta/${tipoEncuestaId}/factores`);
    return response.data;
  },

  async getEstadisticasUsuario(usuarioId: number) {
    if (USE_MOCK_API) {
      try {
        const data = await surveyMockApi.getEstadisticasUsuario(usuarioId);
        return { data, status: 200 };
      } catch (error) {
        const axiosLikeError = { 
          response: { 
            data: { 
              message: error instanceof Error ? error.message : 'Error desconocido' 
            },
            status: 400
          },
          isAxiosError: true,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
        return Promise.reject(axiosLikeError);
      }
    }
    const response = await api.get(`/api/usuarios/${usuarioId}/estadisticas`);
    return response.data;
  },

  async downloadEncuestasCSV(params?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    tipo_encuesta_id?: number;
    finca_id?: number;
    completada?: boolean;
  }) {
    const response = await api.get('/api/reportes/encuestas/csv', {
      params,
      responseType: 'blob',
    });

    // Crear blob y descargar
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `reporte_encuestas_${timestamp}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Reporte descargado exitosamente' };
  },

  // Vista previa del reporte
  async getEncuestasReportPreview(params?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    tipo_encuesta_id?: number;
    finca_id?: number;
    completada?: boolean;
    page?: number;
    limit?: number;
  }) {
    if (USE_MOCK_API) {
      // Mock para desarrollo
      const mockData = {
        data: await surveyMockApi.getEncuestas(params),
        total: 50,
        page: params?.page || 1,
        totalPages: 5,
        filters_applied: params || {},
        message: 'Vista previa del reporte (50 registros encontrados)'
      };
      return { data: mockData, status: 200 };
    }
    
    const response = await api.get('/api/reportes/encuestas/preview', { params });
    return response.data;
  },
};

export const surveyApi = surveyApiWrapper;