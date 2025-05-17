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
  FactorFilters
} from '../types/survey';

const USE_MOCK_API = true; // Cambiar a false cuando tengas el backend real

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
    return api.get('/tipos-encuesta');
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
    return api.get(`/tipos-encuesta/${id}`);
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
    return api.get('/factores', { params });
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
    return api.get(`/factores/${id}`);
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
    return api.post('/factores', data);
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
    return api.put(`/factores/${id}`, data);
  },

  // Fincas
  async getFincas(params?: any) {
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
    return api.get('/fincas', { params });
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
    return api.get(`/fincas/${id}`);
  },

  async createFinca(data: CreateFincaData, usuarioId: number) {
    if (USE_MOCK_API) {
      try {
        const newFinca = await surveyMockApi.createFinca(data, usuarioId);
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
    return api.post('/fincas', data);
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
    return api.put(`/fincas/${id}`, data);
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
    return api.get('/encuestas', { params });
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
    return api.get(`/encuestas/${id}`);
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
    return api.post('/encuestas', data);
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
    return api.put(`/encuestas/${id}`, data);
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
    return api.delete(`/encuestas/${id}`);
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
    return api.get(`/tipos-encuesta/${tipoEncuestaId}/factores`);
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
    return api.get(`/usuarios/${usuarioId}/estadisticas`);
  },
};

export const surveyApi = surveyApiWrapper;