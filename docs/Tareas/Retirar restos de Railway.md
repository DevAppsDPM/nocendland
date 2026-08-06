---
Nombre: Retirar restos de Railway
Estado: Pendiente
Resumen: Eliminar la configuración heredada del despliegue en Railway y revisar el redirect obsoleto de Supabase para localhost:3000.
Decisiones: Vercel es la plataforma de despliegue actual; Railway deja de formar parte de la arquitectura objetivo.
Bloqueada: []
Fecha de creación: 2026-08-06
Última modificación: 2026-08-06
---

# Retirar restos de Railway

## Contexto

El repositorio todavía contiene `nixpacks.toml` y `Caddyfile`, asociados al despliegue anterior en Railway. La configuración de autenticación de Supabase conserva además un redirect para `http://localhost:3000`, mientras que el desarrollo actual usa el puerto `4200`.

## Alcance

- Confirmar que Vercel no depende de los archivos heredados.
- Eliminar `nixpacks.toml` y `Caddyfile`.
- Retirar de Supabase el redirect obsoleto de `localhost:3000` si no tiene otro consumidor.
- Comprobar desarrollo local, build y despliegue después de la limpieza.

## Criterios de finalización

- No quedan artefactos de Railway en el repositorio ni en la documentación activa.
- Los redirects de Supabase solo contienen los entornos realmente utilizados.
- La aplicación funciona en local y en Vercel.
