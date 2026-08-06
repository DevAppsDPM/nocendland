---
Nombre: Crear catálogo técnico reutilizable
Estado: Planificando
Resumen: Diseñar en la bóveda un índice compacto de APIs, servicios y componentes públicos reutilizables para evitar duplicación y reducir el contexto que necesitan consultar los agentes.
Decisiones: El catálogo incluirá solo piezas públicas reutilizables y resumirá ruta, propósito, contrato, ámbito y estado; el código seguirá siendo la fuente de verdad y se evitará documentar manualmente cada detalle interno.
Bloqueada: []
Fecha de creación: 2026-08-06
Última modificación: 2026-08-06
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
