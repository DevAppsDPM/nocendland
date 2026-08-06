---
Nombre: Definir sistema visual y retirar Angular Material
Estado: Planificando
Resumen: Trabajo pospuesto para buscar referencias con el usuario, definir la identidad visual de Nocendland y sustituir Angular Material por primitivas propias.
Decisiones: Se retirarán los componentes de Angular Material; el usuario abordará esta tarea más adelante y entonces se decidirán la dirección visual y la posible conservación de Angular CDK.
Bloqueada: []
Fecha de creación: 2026-08-06
Última modificación: 2026-08-06
---

# Definir sistema visual y retirar Angular Material

## Contexto

Angular Material está presente en 24 archivos TypeScript y en el theming global. No es únicamente un cambio de dependencia: formularios, diálogos, drawer, listas, botones, iconos, tarjetas, progreso, selección, tooltips y navegación dependen de sus componentes.

El usuario ha decidido posponer este trabajo hasta comprobar el refactor arquitectónico desplegado. Debe retomarse con él antes de realizar cambios visuales o retirar dependencias.

## Enfoque propuesto

1. Buscar referencias visuales junto con el usuario y acordar una dirección.
2. Crear tokens propios para color, tipografía, espaciado, tamaños, radios, elevación, movimiento y densidad.
3. Construir una capa pequeña de primitivas de interfaz accesibles.
4. Migrar primero el shell y después una porción vertical de Alimentación para validar el sistema.
5. Sustituir progresivamente el resto de componentes Material.
6. Eliminar `@angular/material` y su theming cuando ya no haya consumidores.

## Consideración técnica

La recomendación inicial es no conservar el sistema de theming de Material si se eliminan todos sus componentes. Los tokens propios mediante variables CSS evitan mantener la dependencia y permiten tematizar componentes propios. Angular CDK sí puede conservarse selectivamente para comportamientos sin estilos —por ejemplo overlay, gestión de foco o accesibilidad— si aporta valor y no condiciona la identidad visual.

## Criterios de finalización

- La dirección visual y sus referencias están documentadas.
- Los tokens y primitivas forman un sistema consistente y accesible.
- No quedan componentes ni estilos internos de Angular Material.
- La decisión de conservar o retirar cada parte de Angular CDK está justificada.
- La identidad funciona en escritorio, móvil y como PWA.
