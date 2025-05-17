// src/lib/mock/surveyMockApi.ts

import { 
  CreateEncuestaData, 
  UpdateEncuestaData,
  CreateFactorData,
  UpdateFactorData,
  CreateFincaData,
  UpdateFincaData,
  EncuestaFilters,
  FactorFilters,
  Encuesta,
  RespuestaFactor,
  Factor,
  ValorPosible
} from '../types/survey';

import { 
  mockTiposEncuesta,
  mockFactores,
  mockValoresPosibles,
  mockFincas,
  mockEncuestas,
  mockRespuestasFactores,
  findTipoEncuestaById,
  findFactoresByTipoEncuesta,
  findValoresPosiblesByFactor,
  findFincaById,
  findFincasByUsuario,
  findEncuestaById,
  findRespuestasByEncuesta,
  createEncuesta,
  createFactor,
  createFinca,
  getEncuestasWithFilters
} from './surveyMockData';

const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

let nextRespuestaId = mockRespuestasFactores.length + 1;

export class SurveyMockApi {
  // Tipos de encuesta
  async getTiposEncuesta() {
    await delay();
    return mockTiposEncuesta.filter(tipo => tipo.activo);
  }
  
  async getTipoEncuestaById(id: number) {
    await delay();
    const tipo = findTipoEncuestaById(id);
    if (!tipo) {
      throw new Error('Tipo de encuesta no encontrado');
    }
    return tipo;
  }
  
  // Factores
  async getFactores(params?: FactorFilters) {
    await delay();
    let filteredFactores = [...mockFactores];
    
    if (params?.tipo_encuesta_id) {
      filteredFactores = filteredFactores.filter(
        factor => factor.tipo_encuesta_id === Number(params.tipo_encuesta_id)
      );
    }
    
    if (params?.categoria) {
      filteredFactores = filteredFactores.filter(
        factor => factor.categoria === params.categoria
      );
    }
    
    if (params?.activo !== undefined) {
      const activo = params.activo === true;
      filteredFactores = filteredFactores.filter(
        factor => factor.activo === activo
      );
    }
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredFactores = filteredFactores.filter(
        factor => 
          factor.nombre.toLowerCase().includes(search) ||
          factor.descripcion?.toLowerCase().includes(search)
      );
    }
    
    const total = filteredFactores.length;
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredFactores.slice(startIndex, endIndex),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async getFactorById(id: number) {
    await delay();
    const factor = mockFactores.find(f => f.id === id);
    if (!factor) {
      throw new Error('Factor no encontrado');
    }
    
    // Incluir valores posibles
    const valoresPosibles = findValoresPosiblesByFactor(id);
    return { ...factor, valores_posibles: valoresPosibles };
  }
  
  async createFactor(data: CreateFactorData) {
    await delay();
    const nuevoFactor = createFactor(data);
    return nuevoFactor;
  }
  
  async updateFactor(id: number, data: UpdateFactorData) {
    await delay();
    const factorIndex = mockFactores.findIndex(f => f.id === id);
    if (factorIndex === -1) {
      throw new Error('Factor no encontrado');
    }
    
    // Actualizar solo los campos básicos del factor
    const factorActualizado: Factor = {
      ...mockFactores[factorIndex],
      nombre: data.nombre || mockFactores[factorIndex].nombre,
      descripcion: data.descripcion !== undefined ? data.descripcion : mockFactores[factorIndex].descripcion,
      categoria: data.categoria !== undefined ? data.categoria : mockFactores[factorIndex].categoria,
      activo: data.activo !== undefined ? data.activo : mockFactores[factorIndex].activo,
      updated_at: new Date().toISOString(),
    };
    
    mockFactores[factorIndex] = factorActualizado;
    
    // Si se proporcionan valores posibles nuevos o actualizados
    if (data.valores_posibles && data.valores_posibles.length > 0) {
      // Procesar cada valor posible
      data.valores_posibles.forEach(valor => {
        if (valor.id) {
          // Actualizar valor existente
          const valorIndex = mockValoresPosibles.findIndex(v => v.id === valor.id);
          if (valorIndex !== -1) {
            mockValoresPosibles[valorIndex] = {
              ...mockValoresPosibles[valorIndex],
              valor: valor.valor,
              codigo: valor.codigo,
              descripcion: valor.descripcion,
              activo: valor.activo !== undefined ? valor.activo : mockValoresPosibles[valorIndex].activo,
              updated_at: new Date().toISOString(),
            };
          }
        } else {
          // Crear nuevo valor
          const nuevoValor: ValorPosible = {
            id: mockValoresPosibles.length + 1,
            factor_id: id,
            valor: valor.valor,
            codigo: valor.codigo,
            descripcion: valor.descripcion || '',
            activo: valor.activo !== undefined ? valor.activo : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockValoresPosibles.push(nuevoValor);
        }
      });
    }
    
    return {
      ...factorActualizado,
      valores_posibles: findValoresPosiblesByFactor(id)
    };
  }
  
  // Valores Posibles
  async getValoresPosiblesByFactor(factorId: number) {
    await delay();
    return findValoresPosiblesByFactor(factorId);
  }
  
  // Fincas
  async getFincas(params?: any) {
    await delay();
    let filteredFincas = [...mockFincas];
    
    if (params?.usuario_id) {
      filteredFincas = filteredFincas.filter(
        finca => finca.usuario_id === Number(params.usuario_id)
      );
    }
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredFincas = filteredFincas.filter(
        finca => 
          finca.nombre.toLowerCase().includes(search) ||
          finca.ubicacion?.toLowerCase().includes(search) ||
          finca.propietario?.toLowerCase().includes(search)
      );
    }
    
    return filteredFincas;
  }
  
  async getFincaById(id: number) {
    await delay();
    const finca = findFincaById(id);
    if (!finca) {
      throw new Error('Finca no encontrada');
    }
    return finca;
  }
  
  async createFinca(data: CreateFincaData, usuarioId: number) {
    await delay();
    const nuevaFinca = createFinca(data, usuarioId);
    return nuevaFinca;
  }
  
  async updateFinca(id: number, data: UpdateFincaData) {
    await delay();
    const fincaIndex = mockFincas.findIndex(f => f.id === id);
    if (fincaIndex === -1) {
      throw new Error('Finca no encontrada');
    }
    
    mockFincas[fincaIndex] = {
      ...mockFincas[fincaIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return mockFincas[fincaIndex];
  }
  
  // Encuestas
  async getEncuestas(params?: EncuestaFilters) {
    await delay();
    const result = getEncuestasWithFilters(params || {});
    
    // Enriquecer las encuestas con datos relacionados
    const enrichedData = result.data.map(encuesta => ({
      ...encuesta,
      tipo_encuesta: findTipoEncuestaById(encuesta.tipo_encuesta_id),
      finca: findFincaById(encuesta.finca_id),
    }));
    
    return {
      ...result,
      data: enrichedData,
    };
  }
  
  async getEncuestaById(id: number) {
    await delay();
    const encuesta = findEncuestaById(id);
    if (!encuesta) {
      throw new Error('Encuesta no encontrada');
    }
    
    // Enriquecer con datos relacionados
    const respuestas = findRespuestasByEncuesta(id);
    const respuestasEnriquecidas = respuestas.map(respuesta => {
      const factor = mockFactores.find(f => f.id === respuesta.factor_id);
      const valorPosible = mockValoresPosibles.find(v => v.id === respuesta.valor_posible_id);
      return {
        ...respuesta,
        factor,
        valor_posible: valorPosible,
      };
    });
    
    return {
      ...encuesta,
      tipo_encuesta: findTipoEncuestaById(encuesta.tipo_encuesta_id),
      finca: findFincaById(encuesta.finca_id),
      respuestas: respuestasEnriquecidas,
    };
  }
  
  async createEncuesta(data: CreateEncuestaData, usuarioId: number) {
    await delay();
    
    // Validar que exista el tipo de encuesta
    const tipoEncuesta = findTipoEncuestaById(data.tipo_encuesta_id);
    if (!tipoEncuesta) {
      throw new Error('Tipo de encuesta no válido');
    }
    
    // Validar que exista la finca
    const finca = findFincaById(data.finca_id);
    if (!finca) {
      throw new Error('Finca no encontrada');
    }
    
    // Validar que la finca pertenezca al usuario
    if (finca.usuario_id !== usuarioId) {
      throw new Error('No tiene permisos para crear encuestas en esta finca');
    }
    
    // Validar que los factores y valores correspondan al tipo de encuesta
    if (data.respuestas && data.respuestas.length > 0) {
      const factoresDelTipo = findFactoresByTipoEncuesta(data.tipo_encuesta_id);
      const factoresIds = factoresDelTipo.map(f => f.id);
      
      for (const respuesta of data.respuestas) {
        if (!factoresIds.includes(respuesta.factor_id)) {
          throw new Error(`Factor ${respuesta.factor_id} no corresponde al tipo de encuesta`);
        }
        
        const valoresPosibles = findValoresPosiblesByFactor(respuesta.factor_id);
        const valoresIds = valoresPosibles.map(v => v.id);
        
        if (!valoresIds.includes(respuesta.valor_posible_id)) {
          throw new Error(`Valor ${respuesta.valor_posible_id} no es válido para el factor ${respuesta.factor_id}`);
        }
      }
    }
    
    // Crear encuesta y respuestas
    const nuevaEncuesta = createEncuesta(data, usuarioId);

    // Crear respuestas si se proporcionaron
    if (data.respuestas && data.respuestas.length > 0) {
      data.respuestas.forEach(respuesta => {
        const nuevaRespuesta: RespuestaFactor = {
          id: nextRespuestaId++,
          encuesta_id: nuevaEncuesta.id,
          factor_id: respuesta.factor_id,
          valor_posible_id: respuesta.valor_posible_id,
          respuesta_texto: respuesta.respuesta_texto || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockRespuestasFactores.push(nuevaRespuesta);
      });
    }
    
    // Obtener la encuesta con todos sus datos para devolver
    return this.getEncuestaById(nuevaEncuesta.id);
  }
  
  async updateEncuesta(id: number, data: UpdateEncuestaData, usuarioId: number) {
    await delay();
    const encuestaIndex = mockEncuestas.findIndex(e => e.id === id);
    if (encuestaIndex === -1) {
      throw new Error('Encuesta no encontrada');
    }
    
    const encuesta = mockEncuestas[encuestaIndex];
    
    // Validar que el usuario tenga permisos
    if (encuesta.usuario_id !== usuarioId) {
      throw new Error('No tiene permisos para modificar esta encuesta');
    }
    
    // Si la encuesta ya está completada y se intenta cambiar algo distinto a la propia completitud
    if (encuesta.completada && !data.completada && (
      data.fecha_aplicacion !== undefined || 
      data.observaciones !== undefined || 
      data.respuestas !== undefined
    )) {
      throw new Error('No se pueden modificar los datos de una encuesta completada');
    }
    
    // Actualizar la encuesta sin incluir directamente las respuestas
    const encuestaActualizada: Encuesta = {
      ...encuesta,
      fecha_aplicacion: data.fecha_aplicacion || encuesta.fecha_aplicacion,
      observaciones: data.observaciones !== undefined ? data.observaciones : encuesta.observaciones,
      completada: data.completada !== undefined ? data.completada : encuesta.completada,
      updated_at: new Date().toISOString(),
    };
    
    mockEncuestas[encuestaIndex] = encuestaActualizada;
    
    // Actualizar respuestas si se proporcionaron
    if (data.respuestas && data.respuestas.length > 0) {
      // Eliminar respuestas antiguas
      const respuestasExistentes = mockRespuestasFactores.filter(r => r.encuesta_id === id);
      for (let i = 0; i < respuestasExistentes.length; i++) {
        const index = mockRespuestasFactores.findIndex(r => r.id === respuestasExistentes[i].id);
        if (index !== -1) {
          mockRespuestasFactores.splice(index, 1);
        }
      }
      
      // Agregar nuevas respuestas
      data.respuestas.forEach(respuesta => {
        const nuevaRespuesta: RespuestaFactor = {
          id: nextRespuestaId++,
          encuesta_id: id,
          factor_id: respuesta.factor_id,
          valor_posible_id: respuesta.valor_posible_id,
          respuesta_texto: respuesta.respuesta_texto || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockRespuestasFactores.push(nuevaRespuesta);
      });
    }
    
    // Obtener la encuesta actualizada con todos sus datos
    return this.getEncuestaById(id);
  }
  
  async deleteEncuesta(id: number, usuarioId: number) {
    await delay();
    const encuestaIndex = mockEncuestas.findIndex(e => e.id === id);
    if (encuestaIndex === -1) {
      throw new Error('Encuesta no encontrada');
    }
    
    const encuesta = mockEncuestas[encuestaIndex];
    
    // Validar que el usuario tenga permisos
    if (encuesta.usuario_id !== usuarioId) {
      throw new Error('No tiene permisos para eliminar esta encuesta');
    }
    
    // Si la encuesta está completada, no se puede eliminar
    if (encuesta.completada) {
      throw new Error('No se puede eliminar una encuesta completada');
    }
    
    // Eliminar respuestas asociadas
    const respuestasIndex = mockRespuestasFactores.filter(r => r.encuesta_id === id);
    for (let i = 0; i < respuestasIndex.length; i++) {
      const index = mockRespuestasFactores.findIndex(r => r.id === respuestasIndex[i].id);
      if (index !== -1) {
        mockRespuestasFactores.splice(index, 1);
      }
    }
    
    // Eliminar la encuesta
    mockEncuestas.splice(encuestaIndex, 1);
    
    return { success: true, message: 'Encuesta eliminada correctamente' };
  }
  
  // Método para obtener los factores con sus valores posibles para un tipo de encuesta
  async getFactoresConValoresByTipoEncuesta(tipoEncuestaId: number) {
    await delay();
    const factores = findFactoresByTipoEncuesta(tipoEncuestaId);
    
    return factores.map(factor => ({
      ...factor,
      valores_posibles: findValoresPosiblesByFactor(factor.id),
    }));
  }
  
  // Método para obtener estadísticas básicas
  async getEstadisticasUsuario(usuarioId: number) {
    await delay();
    
    const encuestasUsuario = mockEncuestas.filter(e => e.usuario_id === usuarioId);
    const fincasUsuario = mockFincas.filter(f => f.usuario_id === usuarioId);
    
    const encuestasPorTipo = mockTiposEncuesta.map(tipo => {
      const encuestasTipo = encuestasUsuario.filter(e => e.tipo_encuesta_id === tipo.id);
      return {
        tipo: tipo.nombre,
        cantidad: encuestasTipo.length,
        completadas: encuestasTipo.filter(e => e.completada).length,
        pendientes: encuestasTipo.filter(e => !e.completada).length,
      };
    });
    
    interface EstadisticasMes {
      total: number;
      completadas: number;
      pendientes: number;
    }
    
    const encuestasPorMes: Record<string, EstadisticasMes> = {};
    
    encuestasUsuario.forEach(encuesta => {
      const fecha = new Date(encuesta.fecha_aplicacion);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!encuestasPorMes[mes]) {
        encuestasPorMes[mes] = {
          total: 0,
          completadas: 0,
          pendientes: 0
        };
      }
      
      encuestasPorMes[mes].total++;
      if (encuesta.completada) {
        encuestasPorMes[mes].completadas++;
      } else {
        encuestasPorMes[mes].pendientes++;
      }
    });
    
    return {
      total_encuestas: encuestasUsuario.length,
      encuestas_completadas: encuestasUsuario.filter(e => e.completada).length,
      encuestas_pendientes: encuestasUsuario.filter(e => !e.completada).length,
      total_fincas: fincasUsuario.length,
      encuestas_por_tipo: encuestasPorTipo,
      encuestas_por_mes: Object.entries(encuestasPorMes).map(([mes, datos]) => ({
        mes,
        total: datos.total,
        completadas: datos.completadas,
        pendientes: datos.pendientes
      })),
    };
  }
}

export const surveyMockApi = new SurveyMockApi();