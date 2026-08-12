---
Nombre: Gestionar actualizaciones de la PWA
Estado: En curso
Resumen: Definir e implementar cómo se detectan, comunican y activan nuevas versiones del service worker sin dejar pestañas usando recursos antiguos.
Decisiones: La aplicación comprueba actualizaciones al arrancar, al recuperar visibilidad y cada seis horas; avisa solo cuando la nueva versión está lista, permite posponerla y aplica una recarga completa iniciada por el usuario.
Bloqueada: []
Fecha de creación: 2026-08-06T17:49:32
Última modificación: 2026-08-12T18:44:06
---

# Gestionar actualizaciones de la PWA

## Contexto

Una pestaña abierta puede continuar utilizando recursos de una versión anterior hasta que el nuevo service worker se active. Hace falta una estrategia explícita para que los despliegues sean predecibles para el usuario.

## Aspectos a decidir

- Cuándo comprobar si existe una nueva versión.
- Si la actualización se activa automáticamente o después de confirmación.
- Cómo avisar al usuario sin interrumpir trabajo no guardado.
- Qué métricas o errores permitirán verificar el comportamiento en producción.

## Política aplicada

- El service worker realiza una comprobación al iniciar la aplicación, otra cuando la pestaña vuelve a estar visible y comprobaciones periódicas cada seis horas.
- El aviso solo aparece después de `VERSION_READY`, cuando todos los recursos de la nueva versión ya están disponibles.
- La actualización nunca recarga automáticamente una sesión abierta. El usuario puede posponerla para guardar antes cualquier cambio pendiente.
- Al aceptar, se recarga la página completa para que el documento y sus chunks pertenezcan a la misma versión.
- Los fallos de instalación se registran en la consola; los fallos de comprobación causados por falta de conexión se silencian para conservar el uso offline.

## Criterios de finalización

- La política de actualización está documentada.
- La aplicación informa o actualiza siguiendo esa política.
- El flujo se ha probado con dos versiones consecutivas.
