---
Nombre: Revisar vulnerabilidades transitivas
Estado: Pendiente
Resumen: Revisar y resolver de forma controlada los 59 avisos actuales de pnpm audit, incluidos 35 de severidad alta, sin aplicar correcciones automáticas ni relajar la política de seguridad.
Decisiones: La mayoría de rutas detectadas pertenecen a herramientas de desarrollo como Karma, Tailwind con Sucrase y Angular CLI; se revisarán actualizaciones y overrides exactos caso por caso antes de modificar el lockfile.
Bloqueada: []
Fecha de creación: 2026-08-06T19:21:20
Última modificación: 2026-08-12T17:44:00+02:00
---

# Revisar vulnerabilidades transitivas

## Contexto

La ejecución de `pnpm audit --audit-level high` del 6 de agosto de 2026 encontró 53 vulnerabilidades: 5 bajas, 16 moderadas y 32 altas. Entre las rutas afectadas aparecen dependencias transitivas de Karma, Tailwind/Sucrase y Angular CLI, como `glob`, `minimatch`, `brace-expansion`, `flatted`, `socket.io-parser`, `fast-uri` e `ip-address`.

La comprobación repetida el 12 de agosto de 2026, durante la migración a Node 24, encontró 59 vulnerabilidades: 6 bajas, 18 moderadas y 35 altas. Se mantienen concentradas en dependencias transitivas y se conserva este trabajo separado para revisar cada actualización sin correcciones automáticas.

`pnpm ignored-builds` indicó que no podía identificar scripts ignorados porque no encontraba `node_modules`, aunque la compilación y las pruebas sí resolvieron las dependencias mediante el runtime del workspace. Esta discrepancia también debe aclararse antes de cambiar la configuración.

## Enfoque

1. Clasificar cada ruta por dependencia de producción o de desarrollo y por exposición real.
2. Comprobar qué actualizaciones directas eliminan transitivas vulnerables respetando la cuarentena de siete días.
3. Usar overrides exactos solo cuando sean compatibles y estén justificados.
4. No ejecutar correcciones automáticas de auditoría.
5. Repetir instalación congelada, scripts ignorados, auditoría, build y pruebas después de cada grupo de cambios.

## Criterios de finalización

- No quedan vulnerabilidades altas conocidas o cada excepción tiene riesgo, alcance y decisión documentados.
- La política estricta de `pnpm-workspace.yaml` continúa activa.
- `pnpm ignored-builds` inspecciona correctamente la instalación utilizada por el proyecto.
- La compilación y las pruebas continúan pasando.
