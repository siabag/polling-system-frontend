# 🌱 Sistema de Encuestas para Cultivos de Café

Sistema web para la gestión y análisis de encuestas relacionadas con cultivos de café. Desarrollado con Next.js, TypeScript y Material-UI.

## ✨ Características

- **Gestión de Usuarios**: Sistema completo de autenticación con roles (Administrador, Analista, Encuestador)
- **Encuestas Digitales**: Creación, edición y gestión de encuestas
- **Dashboard Analítico**: Visualización de datos y estadísticas
- **Interfaz Responsiva**: Optimizada para desktop
- **Modo Demo**: Datos simulados para pruebas y demostración

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Material-UI (MUI), Tailwind CSS
- **Backend**: Flask (Python) - API REST
- **Base de Datos**: SQLAlchemy, PostgreSQL
- **Autenticación**: JWT tokens

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun

### 1. Clonar el repositorio

```bash
git clone https://github.com/siabag/polling-system-frontend
cd polling-system-frontend
```

### 2. Instalar dependencias del frontend

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=CaféSurvey
```

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.