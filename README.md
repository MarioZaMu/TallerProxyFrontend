# Frontend: Dashboard de observabilidad de microservicios

Dashboard en React (Vite + TypeScript) del taller de **Patrones de Software** sobre el patrón **Proxy**. Consume la API del [backend](https://github.com/MarioZaMu/TallerProxyBackend) y muestra el estado de Inventario, Pedidos y Pagos en tiempo real.

Stack: React, TypeScript, Tailwind CSS v4, Framer Motion, Recharts, TanStack Query, Lucide, Sonner.

## Funcionalidades

- 3 tarjetas de servicio (total de llamadas, tasa de éxito, tiempo promedio) con números animados.
- Gráfica de líneas con las últimas 20 llamadas por servicio.
- Tabla de logs con polling cada 3 s, paginación y filas expandibles (parámetros, respuesta y stack trace).
- Filtros por servicio, estado y rango de fechas, aplicados en el servidor.
- Botón **Simular carga** y panel **Probar servicio**.
- Tarjeta en rojo con la insignia "Servicio con problemas" cuando la tasa de error supera el 15%.
- Modo claro/oscuro, responsive, accesible, y banner cuando el backend no responde.

## Ejecutar en local

```bash
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev              # http://localhost:5173
```

Otros comandos: `npm run build` (TypeScript + build de producción) y `npm run lint`.

## Estructura

```
src/
  api/          cliente HTTP y llamadas al backend
  components/   tarjetas, gráfica, tabla de logs, filtros, panel de pruebas
  hooks/        polling con TanStack Query, tema, simulación
  lib/          constantes y formateo (es-CO)
  theme/        tokens.css: ÚNICO archivo con la paleta, radios y sombras
  types/        modelos tipados de la API
```

Para cambiar la paleta de colores basta con editar `src/theme/tokens.css`.

## Despliegue en Vercel

1. En <https://vercel.com/new> importa este repositorio (Vercel detecta Vite; `vercel.json` ya está incluido).
2. Agrega la variable de entorno `VITE_API_BASE_URL` con la URL pública del backend en Railway, sin `/` final.
3. **Deploy**. Si cambias la variable después, haz **Redeploy**.
4. En Railway agrega `ALLOWED_ORIGINS` con la URL de Vercel resultante.

## Producción

- Frontend (Vercel): https://taller-proxy-frontend-weld.vercel.app
- Backend (Render): https://taller-proxy-backend-2h5j.onrender.com (health: `/actuator/health`)

El backend gratuito se duerme tras 15 minutos sin tráfico: la primera carga puede tardar hasta un minuto y el dashboard muestra un aviso mientras despierta.
