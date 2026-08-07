---
Nombre: Crear catálogo técnico reutilizable
Estado: En curso
Resumen: El catálogo técnico ya publica y protege automáticamente la superficie común de shared UI; queda ampliar el mismo sistema a stores, utilidades y APIs reutilizables fuera de la capa visual.
Decisiones: El catálogo incluye solo piezas públicas reutilizables y resume ruta, propósito, contrato y ámbito; los entrypoints @shared/ui/* son el acceso público a las primitivas visuales y permanecen separados para conservar los límites lazy; el build impide imports internos, any, rutas de propiedades como texto, redefiniciones de .ui-* y piezas sin catalogar; el código sigue siendo la fuente de verdad.
Bloqueada: []
Fecha de creación: 2026-08-06T19:36:26
Última modificación: 2026-08-06T23:29:32
---

# Crear catálogo técnico reutilizable

## Objetivo

Permitir que una persona o agente descubra rápidamente qué piezas puede reutilizar antes de buscar por todo el repositorio o crear una implementación nueva. Después de localizar una candidata en el catálogo, deberá abrir el código fuente antes de modificarla o depender de su comportamiento detallado.

## Alcance propuesto

- Crear un sistema de la bóveda enlazado desde [[../Inicio|Inicio]].
- Indexar únicamente APIs, servicios, stores, utilidades y componentes que formen parte de la superficie reutilizable del proyecto.
- Resumir por entrada: nombre, tipo, propósito, ruta fuente, ámbito, contrato público, estado y posibles sustituciones o deprecaciones.
- Proporcionar una vista `.base` que permita filtrar por tipo, área, feature y estado.
- Enlazar al código y a decisiones relevantes sin copiar la implementación ni documentación extensa.
- Definir una comprobación o protocolo de actualización para evitar que el catálogo quede obsoleto cuando cambie una superficie pública.

## Principios

- El catálogo sirve para descubrimiento; el código es la fuente de verdad técnica.
- No se documentan detalles privados ni piezas triviales que no deban reutilizarse.
- Antes de crear código reutilizable, se consulta primero el catálogo y después la implementación candidata.
- Una entrada desactualizada debe corregirse o marcarse explícitamente; no se mantiene información dudosa como si fuera vigente.

## Criterios de finalización

- El sistema y su vista están accesibles desde [[../Inicio|Inicio]].
- Un agente puede identificar de una pasada las superficies reutilizables relevantes y su ubicación.
- Existe una política verificable para mantener sincronizados catálogo y código.
- El contenido evita duplicar detalles que ya pertenecen al código fuente.

## Progreso

- [[../Catálogo técnico|El catálogo técnico]] está enlazado desde Inicio y documenta la superficie pública de `shared/ui`.
- Los entrypoints `@shared/ui/*` actúan como única superficie de entrada para consumidores externos sin fusionar los chunks lazy.
- `check:shared-ui` mantiene sincronizados el barrel, el catálogo y los contratos mínimos de tipado.
- `DataListComponent<T>` recibe elementos de presentación tipados y ya no interpreta rutas de propiedades; `CardDataComponent` limita sus valores a texto o número.
- Build de producción, 27 pruebas unitarias y búsqueda/selección múltiple de la lista verificados; el navegador no registró errores.
- Queda inventariar las superficies reutilizables no visuales antes de marcar esta tarea como hecha.
