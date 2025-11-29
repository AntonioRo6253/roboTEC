# roboTEC

Versión: 1.0

## Resumen

roboTEC es una aplicación web construida con React y Vite orientada a experimentar con interfaces y lógica de juegos/visualizaciones sencillas para un proyecto de informática/tecnología educativa. Este README cubre: información general, requisitos básicos, instalación, ejecución en entorno local, estructura del proyecto y consideraciones adicionales.

## Historial de revisión
| Versión | Fecha elaboración | Responsable elaboración | Fecha aprobación | Responsable aprobación |
| ------- | ----------------- | ----------------------- | ---------------- | ---------------------- |
| 1.0     | 29/11/2025        | Rafael             | 30/11/2025               | Cristian                       |

## Cambios respecto a la versión anterior
| Versión | Modificación respecto versión anterior |
| ------- | -------------------------------------- |
| 1.0     | Creación de estructura y documentación inicial |

## Tabla de contenido
1. Introducción  
2. Alcance  
3. Definiciones, siglas y abreviaturas  
4. Aspectos Técnicos  
5. Requisitos de Configuración  
6. Proceso de Configuración o Despliegue  
7. Ingreso / Uso Básico  
8. Estructura del Proyecto  
---
### 1. Introducción
roboTEC es un entorno de prueba para componentes React relacionados con un menú interactivo y módulos de juego. Aprovecha Vite para un desarrollo rápido (HMR) y un bundle optimizado.

### 2. Alcance
Este README aplica al frontend web en la raíz del repositorio `roboTEC`. No cubre otros repositorios o servicios externos. No incluye backend (actualmente basado sólo en recursos estáticos o lógica en cliente).

### 3. Definiciones, siglas y abreviaturas
- HMR: Hot Module Replacement.  
- Vite: Herramienta de bundling y dev server rápida para proyectos web.  
- JSX: Extensión de sintaxis para componentes React.  
- ESLint: Herramienta de análisis estático de código.  
- Entry point: Archivo inicial que monta la aplicación (generalmente `main.jsx`).

### 4. Aspectos Técnicos
#### Lenguajes y frameworks
- Frontend: JavaScript (React + JSX).  
- Herramienta de build/dev: Vite.  
- Estilos: CSS modular simple (`App.css`, `index.css`, `menu.css`, `game.css`).

#### Metodología
Desarrollo iterativo ligero: pruebas rápidas en el navegador, refactor por componentes y separación de vistas (Juego, Menú, etc.).

#### Arquitectura y gestión de datos
- Principalmente client-side.  
- Estado distribuido en componentes; puede evolucionar hacia un store global si crece la complejidad.  
- No se consume aún API externa persistente (puede añadirse futuramente).

#### Patrones de diseño
- Separación de responsabilidades entre componentes de UI (`FiguraContenedora`, `Game`, `App`).  
- Reutilización de assets centralizados (`src/assets/icons.js`).  
- Posible adopción futura de Context API o librerías de estado.

### 5. Requisitos de Configuración
- [Node.js](https://nodejs.org/es/download) >= 18.x (requerido por Vite 5).  
- npm >= 9.x.  
- Navegador moderno (Chrome, Firefox, Edge).  
- RAM mínima: 2 GB (4 GB recomendada).  
- Disco libre: ~300 MB para dependencias y caché.

### 6. Instalacion Local 
#### Clonar el repositorio
```bash
git clone https://github.com/AntonioRo6253/roboTEC
cd roboTEC
```

#### Instalar dependencias
```bash
npm install
```

#### Ejecutar entorno de desarrollo
```bash
npm run dev
```
Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

### Despliegue

#### Build de producción
```bash
npm run build
```
Archivos generados en `dist/`. Servirlos con un servidor estático:
```bash
npm run preview
```

### 7. Ingreso / Uso Básico
Al abrir la aplicación se monta el componente raíz `App`. Desde él se accede al menú y a las vistas de juego (`Game`). Ajustar interacción o navegación agregando rutas (si se incorpora React Router) o estados condicionales.

### 8. Estructura del Proyecto
Resumen de las carpetas y archivos relevantes:
```
roboTEC/
├─ index.html              # Documento HTML base para Vite
├─ vite.config.js          # Configuración de Vite (plugins, server, etc.)
├─ package.json            # Dependencias y scripts (dev, build, preview)
├─ eslint.config.js        # Reglas de linting (formato y calidad de código)
├─ src/
│  ├─ main.jsx             # Punto de entrada: monta <App /> en el DOM
│  ├─ App.jsx              # Componente raíz; orquesta vistas/estilos
│  ├─ Game.jsx             # Lógica y render del módulo de juego
│  ├─ FiguraContenedora.jsx# Ejemplo de componente reutilizable
│  ├─ assets/
│  │  └─ icons.js          # Definiciones/imports de íconos centralizados
│  ├─ App.css              # Estilos asociados a <App />
│  ├─ index.css            # Estilos globales base
│  ├─ menu.css             # Estilos específicos de menú
│  ├─ game.css             # Estilos del juego
├─ public/                 # Recursos estáticos (Game2.html, video/, etc.)
└─ dist/                   # (Se genera tras build) salida lista para deploy
```
Principios de organización:
- Separar componentes de presentación y lógica ligera.  
- Centralizar assets y constantes (íconos) para fácil mantenimiento.  
- Mantener estilos por área funcional (menú, juego) para escalabilidad.  
