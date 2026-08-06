---
Nombre: Probar authGuard
Estado: Pendiente
Resumen: Añadir pruebas reales del guard de autenticación para sesiones válidas, usuarios anónimos y redirección a /auth.
Decisiones: La ruta protegida debe rechazar usuarios anónimos y redirigirlos a /auth.
Bloqueada: []
Fecha de creación: 2026-08-06
Última modificación: 2026-08-06
---

# Probar authGuard

## Alcance

Cubrir al menos estos escenarios:

- Una sesión autenticada puede continuar hacia la ruta solicitada.
- Un usuario anónimo no puede acceder a una ruta protegida.
- El resultado para un usuario anónimo redirige a `/auth`.
- La resolución asíncrona de la sesión no abre temporalmente la ruta protegida.

## Criterios de finalización

- Las pruebas reproducen el comportamiento real del router y del servicio de autenticación.
- Los tres escenarios principales pasan de forma determinista.
- La implementación continúa siendo zoneless y usa Signals como estado principal.
