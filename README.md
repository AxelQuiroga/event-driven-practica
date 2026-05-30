# Peluquería Express - Backend

Backend en Node.js + Express + TypeScript + PostgreSQL para el sistema de gestión de turnos de peluquería con arquitectura basada en eventos.

## 🎯 Objetivo del Proyecto

Este proyecto fullstack explora cómo conviven la persistencia real (guardar datos sagrados en PostgreSQL) con el desacoplamiento asíncrono (hacer tareas secundarias sin hacer esperar al cliente).

### Flujo de Operación

1. **Operación Sagrada (Sincrónica)**: El backend recibe los datos del turno, pasa por las capas y los guarda en PostgreSQL. Si Postgres falla, se le avisa al frontend.

2. **El Grito al Mundo (El Evento)**: Una vez que el turno se guardó con éxito, el caso de uso no se pone a mandar mails ni a calcular estadísticas. Solo agarra el EventBus y grita: "¡turno.sacado!", pasándole los datos del turno.

3. **Efectos Secundarios (Asíncronos)**: El EventBus recibe ese grito y se lo pasa a los servicios anotados para escuchar. El cliente en React ya recibió su "OK, tu turno está reservado", mientras en el fondo se ejecutan los listeners de estadísticas y notificaciones en paralelo.

## 🛠️ Stack Tecnológico

- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos relacional
- **EventBus Pattern** - Desacoplamiento asíncrono

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

Crear archivo `.env` con las variables de entorno:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=peluqueria
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
```

## 🚀 Desarrollo

```bash
npm run dev
```

El servidor corre en `http://localhost:3001`.

## 🏗️ Build

```bash
npm run build
```

## 📁 Estructura

```
backend/
├── src/
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Lógica de negocio
│   ├── repositories/    # Acceso a datos
│   ├── events/          # EventBus y listeners
│   └── index.ts         # Entry point
├── tsconfig.json        # Configuración de TypeScript
└── package.json         # Dependencias
```

## 🔗 API Endpoints

- `GET /api/turnos` - Obtener lista de turnos
- `POST /api/turnos` - Crear nuevo turno
- `DELETE /api/turnos/:id` - Eliminar turno

## 📝 Arquitectura

### Capas

1. **Controllers**: Manejan las requests HTTP
2. **Services**: Contienen la lógica de negocio
3. **Repositories**: Abstracción sobre PostgreSQL
4. **EventBus**: Sistema de eventos para desacoplamiento

### Flujo de Creación de Turno

```
Request → Controller → Service → Repository → PostgreSQL
                                    ↓
                              EventBus.emit('turno.sacado')
                                    ↓
                              Listeners (stats, notifications)
```

## 🔐 Seguridad

- Validación de inputs
- Manejo de errores
- Sanitización de queries

## 📊 Base de Datos

Tabla `turnos`:
- `id` - SERIAL PRIMARY KEY
- `nombre` - VARCHAR NOT NULL
- `servicio` - VARCHAR NOT NULL
- `fecha` - DATE NOT NULL
- `hora` - TIME NOT NULL
- `created_at` - TIMESTAMP DEFAULT NOW()
