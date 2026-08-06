---
Nombre: Gestionar actualizaciones de la PWA
Estado: Pendiente
Resumen: Definir e implementar cómo se detectan, comunican y activan nuevas versiones del service worker sin dejar pestañas usando recursos antiguos.
Decisiones: ""
Bloqueada: []
Fecha de creación: 2026-08-06
Última modificación: 2026-08-06
---

# Gestionar actualizaciones de la PWA

## Contexto

Una pestaña abierta puede continuar utilizando recursos de una versión anterior hasta que el nuevo service worker se active. Hace falta una estrategia explícita para que los despliegues sean predecibles para el usuario.

## Aspectos a decidir

- Cuándo comprobar si existe una nueva versión.
- Si la actualización se activa automáticamente o después de confirmación.
- Cómo avisar al usuario sin interrumpir trabajo no guardado.
- Qué métricas o errores permitirán verificar el comportamiento en producción.

## Criterios de finalización

- La política de actualización está documentada.
- La aplicación informa o actualiza siguiendo esa política.
- El flujo se ha probado con dos versiones consecutivas.
