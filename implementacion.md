# Documentación para Implementación de Backend del Sistema de Encuestas de Café

## Estructura de Datos a Recibir del Frontend

### 1. Creación de Encuestas (POST /api/encuestas)

```json
{
  "fecha_aplicacion": "2023-05-20",
  "tipo_encuesta_id": 1,
  "finca_id": 1,
  "observaciones": "Observaciones de prueba",
  "respuestas": [
    {
      "factor_id": 1,
      "valor_posible_id": 2,
      "respuesta_texto": "Comentario adicional"
    },
    {
      "factor_id": 2,
      "valor_posible_id": 6,
      "respuesta_texto": ""
    }
  ]
}
```

### 2. Actualización de Encuestas (PUT /api/encuestas/{id})

```json
{
  "fecha_aplicacion": "2023-05-20",
  "observaciones": "Observaciones actualizadas",
  "completada": true,
  "respuestas": [
    {
      "factor_id": 1,
      "valor_posible_id": 3,
      "respuesta_texto": "Comentario actualizado"
    },
    {
      "factor_id": 2,
      "valor_posible_id": 7,
      "respuesta_texto": ""
    }
  ]
}
```

## Estructura de Respuestas del Backend

### 1. Listado de Encuestas (GET /api/encuestas)

```json
{
  "data": [
    {
      "id": 1,
      "fecha_aplicacion": "2023-04-15",
      "tipo_encuesta_id": 1,
      "usuario_id": 1,
      "finca_id": 1,
      "observaciones": "Encuesta realizada después de la cosecha principal",
      "completada": true,
      "created_at": "2023-04-15T10:00:00.000Z",
      "tipo_encuesta": {
        "id": 1,
        "nombre": "P1"
      },
      "finca": {
        "id": 1,
        "nombre": "La Esperanza"
      }
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

### 2. Detalle de Encuesta (GET /api/encuestas/{id})

```json
{
  "id": 1,
  "fecha_aplicacion": "2023-04-15",
  "tipo_encuesta_id": 1,
  "usuario_id": 1,
  "finca_id": 1,
  "observaciones": "Encuesta realizada después de la cosecha principal",
  "completada": true,
  "created_at": "2023-04-15T10:00:00.000Z",
  "updated_at": "2023-04-15T11:30:00.000Z",
  "tipo_encuesta": {
    "id": 1,
    "nombre": "P1",
    "descripcion": "Encuesta quincenal tipo P1"
  },
  "finca": {
    "id": 1,
    "nombre": "La Esperanza",
    "ubicacion": "Vereda El Carmelo, Popayán, Cauca"
  },
  "respuestas": [
    {
      "id": 1,
      "encuesta_id": 1,
      "factor_id": 1,
      "valor_posible_id": 2,
      "respuesta_texto": "Algunos granos presentaron daño leve por broca",
      "factor": {
        "id": 1,
        "nombre": "Calidad del grano",
        "descripcion": "Evaluación de la calidad física de los granos de café",
        "categoria": "Cosecha"
      },
      "valor_posible": {
        "id": 2,
        "valor": "Bueno",
        "codigo": 4,
        "descripcion": "Granos mayormente uniformes, pocos defectos"
      }
    },
    {
      "id": 2,
      "encuesta_id": 1,
      "factor_id": 2,
      "valor_posible_id": 6,
      "respuesta_texto": "",
      "factor": {
        "id": 2,
        "nombre": "Estado de maduración",
        "descripcion": "Nivel de maduración de los granos cosechados",
        "categoria": "Cosecha"
      },
      "valor_posible": {
        "id": 6,
        "valor": "Óptimo",
        "codigo": 5,
        "descripcion": "Más del 90% de granos maduros"
      }
    }
  ]
}
```

### 3. Factores por Tipo de Encuesta (GET /api/tipos-encuesta/{id}/factores)

```json
[
  {
    "id": 1,
    "nombre": "Calidad del grano",
    "descripcion": "Evaluación de la calidad física de los granos de café",
    "categoria": "Cosecha",
    "activo": true,
    "tipo_encuesta_id": 1,
    "valores_posibles": [
      {
        "id": 1,
        "factor_id": 1,
        "valor": "Excelente",
        "codigo": 5,
        "descripcion": "Granos uniformes, sin defectos visibles",
        "activo": true
      },
      {
        "id": 2,
        "factor_id": 1,
        "valor": "Bueno",
        "codigo": 4,
        "descripcion": "Granos mayormente uniformes, pocos defectos",
        "activo": true
      }
    ]
  },
  {
    "id": 2,
    "nombre": "Estado de maduración",
    "descripcion": "Nivel de maduración de los granos cosechados",
    "categoria": "Cosecha",
    "activo": true,
    "tipo_encuesta_id": 1,
    "valores_posibles": [
      {
        "id": 6,
        "factor_id": 2,
        "valor": "Óptimo",
        "codigo": 5,
        "descripcion": "Más del 90% de granos maduros",
        "activo": true
      }
    ]
  }
]
```

## Implementación en Python Flask

### 1. Endpoint para Crear Encuesta

```python
@app.route('/api/encuestas', methods=['POST'])
@jwt_required()
def create_encuesta():
    """Crear una nueva encuesta."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validar datos mínimos
        if not data:
            return jsonify({'error': True, 'message': 'No se proporcionaron datos'}), 400
        
        # Validaciones básicas
        if 'fecha_aplicacion' not in data:
            return jsonify({'error': True, 'message': 'La fecha de aplicación es requerida'}), 400
            
        if 'tipo_encuesta_id' not in data:
            return jsonify({'error': True, 'message': 'El tipo de encuesta es requerido'}), 400
            
        if 'finca_id' not in data:
            return jsonify({'error': True, 'message': 'La finca es requerida'}), 400
        
        # Convertir tipos de datos
        fecha_aplicacion = data['fecha_aplicacion']
        tipo_encuesta_id = int(data['tipo_encuesta_id'])
        finca_id = int(data['finca_id'])
        observaciones = data.get('observaciones', '')
        
        # Verificar finca
        finca = Finca.query.filter_by(id=finca_id).first()
        if not finca:
            return jsonify({'error': True, 'message': 'Finca no encontrada'}), 404
            
        if finca.usuario_id != user_id:
            return jsonify({'error': True, 'message': 'No tiene permisos para esta finca'}), 403
        
        # Verificar tipo de encuesta
        tipo_encuesta = TipoEncuesta.query.filter_by(id=tipo_encuesta_id, activo=True).first()
        if not tipo_encuesta:
            return jsonify({'error': True, 'message': 'Tipo de encuesta no válido'}), 400
        
        # Iniciar transacción
        with db.session.begin():
            # Crear encuesta
            nueva_encuesta = Encuesta(
                fecha_aplicacion=fecha_aplicacion,
                tipo_encuesta_id=tipo_encuesta_id,
                usuario_id=user_id,
                finca_id=finca_id,
                observaciones=observaciones,
                completada=False
            )
            db.session.add(nueva_encuesta)
            db.session.flush()  # Para obtener el ID generado
            
            # Procesar respuestas
            if 'respuestas' in data and data['respuestas']:
                # Obtener factores válidos
                factores = Factor.query.filter_by(
                    tipo_encuesta_id=tipo_encuesta_id,
                    activo=True
                ).all()
                factores_map = {f.id: f for f in factores}
                
                # Obtener valores posibles
                factor_ids = [f.id for f in factores]
                valores = ValorPosible.query.filter(
                    ValorPosible.factor_id.in_(factor_ids),
                    ValorPosible.activo == True
                ).all()
                
                valores_map = {}
                for v in valores:
                    if v.factor_id not in valores_map:
                        valores_map[v.factor_id] = {}
                    valores_map[v.factor_id][v.id] = v
                
                # Crear respuestas
                for resp in data['respuestas']:
                    factor_id = int(resp['factor_id'])
                    valor_id = int(resp['valor_posible_id'])
                    
                    # Validar factor
                    if factor_id not in factores_map:
                        return jsonify({
                            'error': True, 
                            'message': f'Factor {factor_id} no válido para este tipo'
                        }), 400
                    
                    # Validar valor
                    if factor_id not in valores_map or valor_id not in valores_map[factor_id]:
                        return jsonify({
                            'error': True, 
                            'message': f'Valor {valor_id} no válido para factor {factor_id}'
                        }), 400
                    
                    # Crear respuesta
                    nueva_respuesta = RespuestaFactor(
                        encuesta_id=nueva_encuesta.id,
                        factor_id=factor_id,
                        valor_posible_id=valor_id,
                        respuesta_texto=resp.get('respuesta_texto', '')
                    )
                    db.session.add(nueva_respuesta)
        
        # Retornar datos de la encuesta creada
        encuesta_data = get_encuesta_with_details(nueva_encuesta.id)
        return jsonify(encuesta_data), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({'error': True, 'message': 'Error al crear encuesta'}), 500
```

### 2. Endpoint para Actualizar Encuesta

```python
@app.route('/api/encuestas/<int:encuesta_id>', methods=['PUT'])
@jwt_required()
def update_encuesta(encuesta_id):
    """Actualizar una encuesta existente."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validar datos
        if not data:
            return jsonify({'error': True, 'message': 'No se proporcionaron datos'}), 400
        
        # Buscar encuesta
        encuesta = Encuesta.query.filter_by(id=encuesta_id).first()
        if not encuesta:
            return jsonify({'error': True, 'message': 'Encuesta no encontrada'}), 404
        
        # Verificar permisos
        usuario = Usuario.query.get(user_id)
        is_admin = usuario.rol.nombre == 'administrador'
        
        if encuesta.usuario_id != user_id and not is_admin:
            return jsonify({'error': True, 'message': 'No tiene permisos'}), 403
        
        # Verificar si está completada
        if encuesta.completada and not is_admin:
            return jsonify({'error': True, 'message': 'No se puede modificar una encuesta completada'}), 400
        
        # Iniciar transacción
        with db.session.begin():
            # Actualizar campos
            if 'fecha_aplicacion' in data:
                encuesta.fecha_aplicacion = data['fecha_aplicacion']
                
            if 'observaciones' in data:
                encuesta.observaciones = data['observaciones']
                
            if 'completada' in data:
                encuesta.completada = bool(data['completada'])
            
            # Actualizar respuestas
            if 'respuestas' in data and data['respuestas']:
                # Eliminar respuestas existentes
                RespuestaFactor.query.filter_by(encuesta_id=encuesta.id).delete()
                
                # Obtener factores válidos
                factores = Factor.query.filter_by(
                    tipo_encuesta_id=encuesta.tipo_encuesta_id,
                    activo=True
                ).all()
                factores_map = {f.id: f for f in factores}
                
                # Obtener valores posibles
                factor_ids = [f.id for f in factores]
                valores = ValorPosible.query.filter(
                    ValorPosible.factor_id.in_(factor_ids),
                    ValorPosible.activo == True
                ).all()
                
                valores_map = {}
                for v in valores:
                    if v.factor_id not in valores_map:
                        valores_map[v.factor_id] = {}
                    valores_map[v.factor_id][v.id] = v
                
                # Crear nuevas respuestas
                for resp in data['respuestas']:
                    factor_id = int(resp['factor_id'])
                    valor_id = int(resp['valor_posible_id'])
                    
                    # Validar factor
                    if factor_id not in factores_map:
                        return jsonify({
                            'error': True, 
                            'message': f'Factor {factor_id} no válido para este tipo'
                        }), 400
                    
                    # Validar valor
                    if factor_id not in valores_map or valor_id not in valores_map[factor_id]:
                        return jsonify({
                            'error': True, 
                            'message': f'Valor {valor_id} no válido para factor {factor_id}'
                        }), 400
                    
                    # Crear respuesta
                    nueva_respuesta = RespuestaFactor(
                        encuesta_id=encuesta.id,
                        factor_id=factor_id,
                        valor_posible_id=valor_id,
                        respuesta_texto=resp.get('respuesta_texto', '')
                    )
                    db.session.add(nueva_respuesta)
        
        # Retornar datos de la encuesta actualizada
        encuesta_data = get_encuesta_with_details(encuesta.id)
        return jsonify(encuesta_data)
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({'error': True, 'message': 'Error al actualizar encuesta'}), 500
```

### 3. Endpoint para Eliminar Encuesta

```python
@app.route('/api/encuestas/<int:encuesta_id>', methods=['DELETE'])
@jwt_required()
def delete_encuesta(encuesta_id):
    """Eliminar una encuesta existente."""
    try:
        user_id = get_jwt_identity()
        
        # Buscar encuesta
        encuesta = Encuesta.query.filter_by(id=encuesta_id).first()
        if not encuesta:
            return jsonify({'error': True, 'message': 'Encuesta no encontrada'}), 404
        
        # Verificar permisos
        usuario = Usuario.query.get(user_id)
        is_admin = usuario.rol.nombre == 'administrador'
        
        if encuesta.usuario_id != user_id and not is_admin:
            return jsonify({'error': True, 'message': 'No tiene permisos'}), 403
        
        # Verificar si está completada
        if encuesta.completada and not is_admin:
            return jsonify({'error': True, 'message': 'No se puede eliminar una encuesta completada'}), 400
        
        # Eliminar encuesta y respuestas asociadas
        with db.session.begin():
            RespuestaFactor.query.filter_by(encuesta_id=encuesta.id).delete()
            db.session.delete(encuesta)
        
        return jsonify({'success': True, 'message': 'Encuesta eliminada correctamente'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({'error': True, 'message': 'Error al eliminar encuesta'}), 500
```

### 4. Función Auxiliar para Obtener Detalles de Encuesta

```python
def get_encuesta_with_details(encuesta_id):
    """Obtiene una encuesta con todos sus detalles relacionados."""
    encuesta = Encuesta.query.get(encuesta_id)
    if not encuesta:
        return None
    
    # Obtener datos relacionados
    tipo_encuesta = TipoEncuesta.query.get(encuesta.tipo_encuesta_id)
    finca = Finca.query.get(encuesta.finca_id)
    respuestas = RespuestaFactor.query.filter_by(encuesta_id=encuesta.id).all()
    
    # Factores y valores
    factor_ids = [r.factor_id for r in respuestas]
    valor_ids = [r.valor_posible_id for r in respuestas]
    
    factores = {f.id: f for f in Factor.query.filter(Factor.id.in_(factor_ids)).all()}
    valores = {v.id: v for v in ValorPosible.query.filter(ValorPosible.id.in_(valor_ids)).all()}
    
    # Preparar respuestas
    respuestas_data = []
    for r in respuestas:
        factor = factores.get(r.factor_id)
        valor = valores.get(r.valor_posible_id)
        
        respuestas_data.append({
            'id': r.id,
            'encuesta_id': r.encuesta_id,
            'factor_id': r.factor_id,
            'valor_posible_id': r.valor_posible_id,
            'respuesta_texto': r.respuesta_texto,
            'factor': {
                'id': factor.id,
                'nombre': factor.nombre,
                'descripcion': factor.descripcion,
                'categoria': factor.categoria
            } if factor else None,
            'valor_posible': {
                'id': valor.id,
                'valor': valor.valor,
                'codigo': valor.codigo,
                'descripcion': valor.descripcion
            } if valor else None
        })
    
    # Preparar resultado
    return {
        'id': encuesta.id,
        'fecha_aplicacion': encuesta.fecha_aplicacion.isoformat(),
        'tipo_encuesta_id': encuesta.tipo_encuesta_id,
        'usuario_id': encuesta.usuario_id,
        'finca_id': encuesta.finca_id,
        'observaciones': encuesta.observaciones,
        'completada': encuesta.completada,
        'created_at': encuesta.created_at.isoformat(),
        'updated_at': encuesta.updated_at.isoformat() if encuesta.updated_at else None,
        'tipo_encuesta': {
            'id': tipo_encuesta.id,
            'nombre': tipo_encuesta.nombre,
            'descripcion': tipo_encuesta.descripcion
        } if tipo_encuesta else None,
        'finca': {
            'id': finca.id,
            'nombre': finca.nombre,
            'ubicacion': finca.ubicacion
        } if finca else None,
        'respuestas': respuestas_data
    }
```

## Modelos SQLAlchemy

### 1. Modelo de Encuesta

```python
class Encuesta(db.Model):
    __tablename__ = 'encuesta'
    
    id = db.Column(db.Integer, primary_key=True)
    fecha_aplicacion = db.Column(db.Date, nullable=False)
    tipo_encuesta_id = db.Column(db.Integer, db.ForeignKey('tipo_encuesta.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    finca_id = db.Column(db.Integer, db.ForeignKey('finca.id'), nullable=False)
    observaciones = db.Column(db.Text, default='')
    completada = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    tipo_encuesta = db.relationship('TipoEncuesta', backref='encuestas')
    usuario = db.relationship('Usuario', backref='encuestas')
    finca = db.relationship('Finca', backref='encuestas')
    respuestas = db.relationship('RespuestaFactor', backref='encuesta', cascade='all, delete-orphan')
```

### 2. Modelo de Respuesta a Factor

```python
class RespuestaFactor(db.Model):
    __tablename__ = 'respuesta_factor'
    
    id = db.Column(db.Integer, primary_key=True)
    encuesta_id = db.Column(db.Integer, db.ForeignKey('encuesta.id'), nullable=False)
    factor_id = db.Column(db.Integer, db.ForeignKey('factor.id'), nullable=False)
    valor_posible_id = db.Column(db.Integer, db.ForeignKey('valor_posible.id'), nullable=False)
    respuesta_texto = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Restricción única
    __table_args__ = (
        db.UniqueConstraint('encuesta_id', 'factor_id', name='uk_respuesta_encuesta_factor'),
    )
    
    # Relaciones
    factor = db.relationship('Factor', backref='respuestas')
    valor_posible = db.relationship('ValorPosible', backref='respuestas')
```

## Recomendaciones para la Implementación

### 1. Validación de Datos

Siempre valide los datos recibidos del frontend antes de procesarlos:

- Tipos de datos correctos (enteros, cadenas, booleanos)
- Valores requeridos presentes
- Restricciones de dominio (valores entre rangos, valores de enumeración)
- Verificación de existencia de entidades relacionadas (fincas, tipos de encuesta)
- Verificación de permisos del usuario para acceder o modificar recursos

### 2. Manejo de Transacciones

Use transacciones para asegurar la integridad de los datos. Esto es especialmente importante cuando se realizan múltiples operaciones relacionadas, como crear una encuesta y sus respuestas.

```python
with db.session.begin():
    # Todas las operaciones aquí se ejecutan en una transacción
    # Si hay un error, se hace rollback automáticamente
```

### 3. Control de Acceso

Implemente un sistema de control de acceso basado en roles:

- Administradores: Pueden hacer todo
- Encuestadores: Solo pueden ver, crear, editar y eliminar sus propias encuestas
- Analistas: Pueden ver todas las encuestas pero no modificarlas

```python
# Verificar permisos
usuario = Usuario.query.get(user_id)
is_admin = usuario.rol.nombre == 'administrador'
is_analyst = usuario.rol.nombre == 'analista'

if encuesta.usuario_id != user_id and not (is_admin or is_analyst):
    return jsonify({'error': True, 'message': 'No tiene permisos'}), 403

# Para operaciones de modificación
if encuesta.usuario_id != user_id and not is_admin:
    return jsonify({'error': True, 'message': 'No tiene permisos para modificar'}), 403
```

### 4. Campos Opcionales

Para campos opcionales, siempre proporcione valores predeterminados:

- Para cadenas: cadena vacía (`''`)
- Para números: `0`
- Para fechas: `None` o la fecha actual
- Para booleanos: `False`

```python
observaciones = data.get('observaciones', '')
respuesta_texto = respuesta_data.get('respuesta_texto', '')
```

### 5. Manejo de Errores

Implemente un sistema consistente de manejo de errores:

```python
try:
    # Código que puede generar errores
except Exception as e:
    db.session.rollback()  # Rollback de transacción si es necesario
    print(f"Error: {str(e)}")  # Log del error
    return jsonify({'error': True, 'message': 'Mensaje de error apropiado'}), 500  # Respuesta de error
```

### 6. Paginación

Para listados, siempre implemente paginación:

```python
@app.route('/api/encuestas', methods=['GET'])
@jwt_required()
def list_encuestas():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    query = Encuesta.query
    # Aplicar filtros...
    
    pagination = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'data': [item.to_dict() for item in pagination.items],
        'total': pagination.total,
        'page': page,
        'totalPages': pagination.pages
    })
```

## Notas Adicionales

### 1. Conversión de Tipos

Siempre convierta los valores recibidos del frontend al tipo correcto:

```python
# Convertir IDs a enteros
tipo_encuesta_id = int(data['tipo_encuesta_id'])
finca_id = int(data['finca_id'])
factor_id = int(respuesta['factor_id'])
valor_id = int(respuesta['valor_posible_id'])

# Convertir booleanos
completada = bool(data.get('completada', False))
```

### 2. Fechas

Para fechas, use el formato ISO (YYYY-MM-DD):

```python
# Recibir fecha del frontend
fecha_str = data['fecha_aplicacion']  # '2023-05-20'
fecha_date = datetime.strptime(fecha_str, '%Y-%m-%d').date()

# Enviar fecha al frontend
fecha_iso = fecha_date.isoformat()  # '2023-05-20'
```

### 3. Respuestas JSON

Asegúrese de que todas las respuestas JSON sigan un formato consistente:

- Éxito: `{"success": true, "data": {...}, "message": "..."}`
- Error: `{"error": true, "message": "..."}`

```python
# Respuesta de éxito
return jsonify({
    'success': True,
    'data': encuesta_data,
    'message': 'Encuesta creada correctamente'
}), 201

# Respuesta de error
return jsonify({
    'error': True,
    'message': 'No tiene permisos para realizar esta acción'
}), 403
```