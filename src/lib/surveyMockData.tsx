// src/lib/mock/surveyMockData.ts

import {
  TipoEncuesta,
  Factor,
  ValorPosible,
  Finca,
  Encuesta,
  RespuestaFactor,
  CreateEncuestaData,
  CreateFactorData,
  CreateFincaData,
  EncuestaFilters
} from '../types/survey';

// Datos Mock - Tipos de Encuesta
export const mockTiposEncuesta: TipoEncuesta[] = [
  {
    id: 1,
    nombre: 'P1',
    descripcion: 'Encuesta quincenal tipo P1',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    nombre: 'P2',
    descripcion: 'Encuesta quincenal tipo P2',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    nombre: 'P3',
    descripcion: 'Encuesta quincenal tipo P3',
    activo: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    nombre: 'P4',
    descripcion: 'Encuesta quincenal tipo P4',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

// Datos Mock - Factores
export const mockFactores: Factor[] = [
  {
    id: 1,
    nombre: 'Calidad del grano',
    descripcion: 'Evaluación de la calidad física de los granos de café',
    categoria: 'Cosecha',
    activo: true,
    tipo_encuesta_id: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    nombre: 'Estado de maduración',
    descripcion: 'Nivel de maduración de los granos cosechados',
    categoria: 'Cosecha',
    activo: true,
    tipo_encuesta_id: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    nombre: 'Secado de café',
    descripcion: 'Condiciones del proceso de secado',
    categoria: 'Poscosecha',
    activo: true,
    tipo_encuesta_id: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    nombre: 'Estado de sombrío',
    descripcion: 'Condición del sombrío para los cafetales',
    categoria: 'Cultivo',
    activo: true,
    tipo_encuesta_id: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    nombre: 'Control de plagas',
    descripcion: 'Nivel de control de plagas aplicado',
    categoria: 'Sanidad',
    activo: true,
    tipo_encuesta_id: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    nombre: 'Fertilización',
    descripcion: 'Evaluación del programa de fertilización',
    categoria: 'Cultivo',
    activo: true,
    tipo_encuesta_id: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 7,
    nombre: 'Acidez del suelo',
    descripcion: 'Medición de la acidez del suelo en los lotes',
    categoria: 'Suelo',
    activo: true,
    tipo_encuesta_id: 4,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 8,
    nombre: 'Conservación de aguas',
    descripcion: 'Evaluación de prácticas de conservación de fuentes hídricas',
    categoria: 'Ambiental',
    activo: true,
    tipo_encuesta_id: 4,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

// Datos Mock - Valores Posibles
export const mockValoresPosibles: ValorPosible[] = [
  // Valores para 'Calidad del grano'
  {
    id: 1,
    factor_id: 1,
    valor: 'Excelente',
    codigo: 5,
    descripcion: 'Granos uniformes, sin defectos visibles',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    factor_id: 1,
    valor: 'Bueno',
    codigo: 4,
    descripcion: 'Granos mayormente uniformes, pocos defectos',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    factor_id: 1,
    valor: 'Regular',
    codigo: 3,
    descripcion: 'Presencia moderada de defectos',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    factor_id: 1,
    valor: 'Deficiente',
    codigo: 2,
    descripcion: 'Alta presencia de defectos',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    factor_id: 1,
    valor: 'Malo',
    codigo: 1,
    descripcion: 'Granos muy desiguales, muchos defectos',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Valores para 'Estado de maduración'
  {
    id: 6,
    factor_id: 2,
    valor: 'Óptimo',
    codigo: 5,
    descripcion: 'Más del 90% de granos maduros',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 7,
    factor_id: 2,
    valor: 'Mayoría maduros',
    codigo: 4,
    descripcion: '70-90% de granos maduros',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 8,
    factor_id: 2,
    valor: 'Mezcla',
    codigo: 3,
    descripcion: '50-70% de granos maduros',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 9,
    factor_id: 2,
    valor: 'Mayoría verdes',
    codigo: 2,
    descripcion: '30-50% de granos maduros',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 10,
    factor_id: 2,
    valor: 'Inmaduro',
    codigo: 1,
    descripcion: 'Menos del 30% de granos maduros',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Valores para 'Secado de café'
  {
    id: 11,
    factor_id: 3,
    valor: 'Excelente',
    codigo: 5,
    descripcion: 'Secado uniforme, humedad óptima',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 12,
    factor_id: 3,
    valor: 'Bueno',
    codigo: 4,
    descripcion: 'Secado adecuado con pequeñas variaciones',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 13,
    factor_id: 3,
    valor: 'Regular',
    codigo: 3,
    descripcion: 'Humedad variable pero aceptable',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 14,
    factor_id: 3,
    valor: 'Deficiente',
    codigo: 2,
    descripcion: 'Humedad inconsistente, riesgo de moho',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 15,
    factor_id: 3,
    valor: 'Malo',
    codigo: 1,
    descripcion: 'Secado inadecuado, demasiado húmedo o sobre-secado',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Valores para los demás factores (similar pattern)
  {
    id: 16,
    factor_id: 4,
    valor: 'Excelente',
    codigo: 5,
    descripcion: 'Sombrío adecuado y bien distribuido',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 17,
    factor_id: 4,
    valor: 'Bueno',
    codigo: 4,
    descripcion: 'Sombrío adecuado en la mayoría del área',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  // ... más valores para cada factor
  
  {
    id: 30,
    factor_id: 7,
    valor: 'Óptimo',
    codigo: 5,
    descripcion: 'pH adecuado para café (5.0-5.5)',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  {
    id: 35,
    factor_id: 8,
    valor: 'Excelente',
    codigo: 5,
    descripcion: 'Fuentes hídricas protegidas, sistemas de ahorro',
    activo: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

// Datos Mock - Fincas
export const mockFincas: Finca[] = [
  {
    id: 1,
    nombre: 'La Esperanza',
    ubicacion: 'Vereda El Carmelo, Popayán, Cauca',
    latitud: "2.4448",
    longitud: "-76.6147",
    propietario: 'Juan Pérez',
    usuario_id: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    nombre: 'Villa Café',
    ubicacion: 'Vereda La Playa, Popayán, Cauca',
    latitud: "2.4890",
    longitud: "-76.5838",
    propietario: 'María Rodríguez',
    usuario_id: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    nombre: 'El Paraíso',
    ubicacion: 'Vereda San Antonio, Timbío, Cauca',
    latitud: "2.3455",
    longitud: "-76.6843",
    propietario: 'Carlos González',
    usuario_id: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    nombre: 'La Montaña',
    ubicacion: 'Vereda El Rosal, Cajibío, Cauca',
    latitud: "2.6234",
    longitud: "-76.5726",
    propietario: 'Ana López',
    usuario_id: 2,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

// Datos Mock - Encuestas
export const mockEncuestas: Encuesta[] = [
  {
    id: 1,
    fecha_aplicacion: '2023-04-15',
    tipo_encuesta_id: 1,
    usuario_id: 1,
    finca_id: 1,
    observaciones: 'Encuesta realizada después de la cosecha principal',
    completada: true,
    created_at: '2023-04-15T10:00:00.000Z',
    updated_at: '2023-04-15T11:30:00.000Z',
  },
  {
    id: 2,
    fecha_aplicacion: '2023-05-01',
    tipo_encuesta_id: 2,
    usuario_id: 1,
    finca_id: 2,
    observaciones: 'Condiciones climáticas favorables',
    completada: true,
    created_at: '2023-05-01T09:00:00.000Z',
    updated_at: '2023-05-01T10:15:00.000Z',
  },
  {
    id: 3,
    fecha_aplicacion: '2023-05-15',
    tipo_encuesta_id: 1,
    usuario_id: 1,
    finca_id: 1,
    observaciones: 'Presencia de broca en algunas áreas',
    completada: false,
    created_at: '2023-05-15T14:00:00.000Z',
    updated_at: '2023-05-15T14:30:00.000Z',
  },
  {
    id: 4,
    fecha_aplicacion: '2023-04-20',
    tipo_encuesta_id: 4,
    usuario_id: 2,
    finca_id: 3,
    observaciones: 'Análisis de suelo realizado recientemente',
    completada: true,
    created_at: '2023-04-20T11:00:00.000Z',
    updated_at: '2023-04-20T12:00:00.000Z',
  },
  {
    id: 5,
    fecha_aplicacion: '2023-05-10',
    tipo_encuesta_id: 2,
    usuario_id: 2,
    finca_id: 4,
    observaciones: 'Nueva área de cultivo recién sembrada',
    completada: false,
    created_at: '2023-05-10T08:00:00.000Z',
    updated_at: '2023-05-10T09:00:00.000Z',
  },
];

// Datos Mock - Respuestas a factores
export const mockRespuestasFactores: RespuestaFactor[] = [
  // Respuestas para encuesta 1
  {
    id: 1,
    encuesta_id: 1,
    factor_id: 1,
    valor_posible_id: 2, // Bueno
    respuesta_texto: 'Algunos granos presentaron daño leve por broca',
    created_at: '2023-04-15T10:30:00.000Z',
    updated_at: '2023-04-15T10:30:00.000Z',
  },
  {
    id: 2,
    encuesta_id: 1,
    factor_id: 2,
    valor_posible_id: 6, // Óptimo
    respuesta_texto: "prueba texto",
    created_at: '2023-04-15T10:35:00.000Z',
    updated_at: '2023-04-15T10:35:00.000Z',
  },
  {
    id: 3,
    encuesta_id: 1,
    factor_id: 3,
    valor_posible_id: 11, // Excelente
    respuesta_texto: 'Secado en secador solar con resultados óptimos',
    created_at: '2023-04-15T10:40:00.000Z',
    updated_at: '2023-04-15T10:40:00.000Z',
  },
  
  // Respuestas para encuesta 2
  {
    id: 4,
    encuesta_id: 2,
    factor_id: 4,
    valor_posible_id: 17, // Bueno
    respuesta_texto: "prueba texto 2",
    created_at: '2023-05-01T09:15:00.000Z',
    updated_at: '2023-05-01T09:15:00.000Z',
  },
  {
    id: 5,
    encuesta_id: 2,
    factor_id: 5,
    valor_posible_id: 21, // Supongamos que es "Bueno" para control de plagas
    respuesta_texto: 'Se aplicó control biológico en áreas con mayor presencia de broca',
    created_at: '2023-05-01T09:20:00.000Z',
    updated_at: '2023-05-01T09:20:00.000Z',
  },
  {
    id: 6,
    encuesta_id: 2,
    factor_id: 6,
    valor_posible_id: 25, // Supongamos que es "Regular" para fertilización
    respuesta_texto: 'Faltó aplicación en algunas zonas por dificultad de acceso',
    created_at: '2023-05-01T09:25:00.000Z',
    updated_at: '2023-05-01T09:25:00.000Z',
  },
  
  // Respuestas para encuesta 4
  {
    id: 7,
    encuesta_id: 4,
    factor_id: 7,
    valor_posible_id: 30, // Óptimo para acidez del suelo
    respuesta_texto: 'pH promedio de 5.3 según análisis reciente',
    created_at: '2023-04-20T11:20:00.000Z',
    updated_at: '2023-04-20T11:20:00.000Z',
  },
  {
    id: 8,
    encuesta_id: 4,
    factor_id: 8,
    valor_posible_id: 35, // Excelente para conservación de aguas
    respuesta_texto: 'Instalación reciente de sistemas de recolección y tratamiento de aguas residuales',
    created_at: '2023-04-20T11:30:00.000Z',
    updated_at: '2023-04-20T11:30:00.000Z',
  },
];

// Funciones auxiliares
export const findTipoEncuestaById = (id: number) => {
  return mockTiposEncuesta.find(tipo => tipo.id === id);
};

export const findFactoresByTipoEncuesta = (tipoEncuestaId: number) => {
  return mockFactores.filter(factor => factor.tipo_encuesta_id === tipoEncuestaId && factor.activo);
};

export const findValoresPosiblesByFactor = (factorId: number) => {
  return mockValoresPosibles.filter(valor => valor.factor_id === factorId && valor.activo);
};

export const findFincaById = (id: number) => {
  return mockFincas.find(finca => finca.id === id);
};

export const findFincasByUsuario = (usuarioId: number) => {
  return mockFincas.filter(finca => finca.usuario_id === usuarioId);
};

export const findEncuestaById = (id: number) => {
  return mockEncuestas.find(encuesta => encuesta.id === id);
};

export const findRespuestasByEncuesta = (encuestaId: number) => {
  return mockRespuestasFactores.filter(respuesta => respuesta.encuesta_id === encuestaId);
};

// Funciones para crear nuevos elementos
export const createEncuesta = (data: CreateEncuestaData, usuarioId: number): Encuesta => {
  const newId = mockEncuestas.length + 1;
  const now = new Date().toISOString();
  
  const nuevaEncuesta: Encuesta = {
    id: newId,
    fecha_aplicacion: data.fecha_aplicacion,
    tipo_encuesta_id: data.tipo_encuesta_id,
    usuario_id: usuarioId,
    finca_id: data.finca_id,
    observaciones: data.observaciones || "",
    completada: false,
    created_at: now,
    updated_at: now,
  };
  
  mockEncuestas.push(nuevaEncuesta);
  return nuevaEncuesta;
};

export const createFactor = (data: CreateFactorData): Factor => {
  const newId = mockFactores.length + 1;
  const now = new Date().toISOString();
  
  const nuevoFactor: Factor = {
    id: newId,
    nombre: data.nombre,
    descripcion: data.descripcion || "",
    categoria: data.categoria || "",
    activo: true,
    tipo_encuesta_id: data.tipo_encuesta_id,
    created_at: now,
    updated_at: now,
  };
  
  mockFactores.push(nuevoFactor);
  
  // Crear valores posibles asociados
  if (data.valores_posibles && data.valores_posibles.length > 0) {
    data.valores_posibles.forEach((valorData, index) => {
      const valorId = mockValoresPosibles.length + 1 + index;
      
      const nuevoValor: ValorPosible = {
        id: valorId,
        factor_id: newId,
        valor: valorData.valor,
        codigo: valorData.codigo,
        descripcion: valorData.descripcion || "",
        activo: true,
        created_at: now,
        updated_at: now,
      };
      
      mockValoresPosibles.push(nuevoValor);
    });
  }
  
  return nuevoFactor;
};

export const createFinca = (data: CreateFincaData): Finca => {
  const newId = mockFincas.length + 1;
  const now = new Date().toISOString();
  const usuarioId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 1; // Simulamos el usuario actual
  const nuevaFinca: Finca = {
    id: newId,
    nombre: data.nombre,
    ubicacion: data.ubicacion || "",
    latitud: data.latitud || null,
    longitud: data.longitud || null,
    propietario: data.propietario || "",
    usuario_id: usuarioId,
    created_at: now,
    updated_at: now,
  };
  
  mockFincas.push(nuevaFinca);
  return nuevaFinca;
};

// Función para filtrar encuestas
export const getEncuestasWithFilters = (params: EncuestaFilters) => {
  let filteredEncuestas = [...mockEncuestas];
  
  if (params.tipo_encuesta_id) {
    filteredEncuestas = filteredEncuestas.filter(
      encuesta => encuesta.tipo_encuesta_id === Number(params.tipo_encuesta_id)
    );
  }
  
  if (params.finca_id) {
    filteredEncuestas = filteredEncuestas.filter(
      encuesta => encuesta.finca_id === Number(params.finca_id)
    );
  }
  
  if (params.usuario_id) {
    filteredEncuestas = filteredEncuestas.filter(
      encuesta => encuesta.usuario_id === Number(params.usuario_id)
    );
  }
  
  if (params.fecha_desde) {
    filteredEncuestas = filteredEncuestas.filter(
      encuesta => new Date(encuesta.fecha_aplicacion) >= new Date(params.fecha_desde!)
    );
  }
  
  if (params.fecha_hasta) {
    filteredEncuestas = filteredEncuestas.filter(
      encuesta => new Date(encuesta.fecha_aplicacion) <= new Date(params.fecha_hasta!)
    );
  }
  
  if (params.completada !== undefined) {
    filteredEncuestas = filteredEncuestas.filter(
      encuesta => encuesta.completada === params.completada
    );
  }
  
  if (params.search) {
    const search = params.search.toLowerCase();
    filteredEncuestas = filteredEncuestas.filter(
      encuesta => encuesta.observaciones?.toLowerCase().includes(search)
    );
  }
  
  const total = filteredEncuestas.length;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: filteredEncuestas.slice(startIndex, endIndex),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};