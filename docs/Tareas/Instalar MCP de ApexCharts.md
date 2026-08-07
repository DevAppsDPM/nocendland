---
Nombre: Instalar MCP de ApexCharts
Estado: Pendiente
Resumen: Instalar y configurar más adelante el MCP oficial de ApexCharts para que los agentes puedan generar y validar configuraciones y consultar su documentación.
Decisiones: El MCP se tratará como herramienta de desarrollo separada de las dependencias de runtime; su instalación usará pnpm, una versión exacta revisada y una configuración compatible con Codex.
Bloqueada: []
Fecha de creación: 2026-08-06T23:38:46
Última modificación: 2026-08-06T23:38:46
---

# Instalar MCP de ApexCharts

## Objetivo

Incorporar el MCP oficial de ApexCharts al entorno de agentes del proyecto para mejorar la creación, validación y mantenimiento de configuraciones de gráficos.

## Enfoque

1. Revisar el paquete oficial, su licencia, sus scripts de instalación y la versión exacta elegible según la cuarentena del workspace.
2. Confirmar el mecanismo de configuración de MCP compatible con Codex sin utilizar `npx`, `pnpm dlx` ni ejecución efímera no autorizada.
3. Instalarlo como herramienta de desarrollo con pnpm y configuración reproducible cuando corresponda.
4. Verificar que el servidor expone generación, validación, tipos de gráfico y acceso a la base de conocimiento.
5. Documentar su uso sin convertirlo en una dependencia de runtime de la aplicación.

## Criterios de finalización

- El MCP oficial funciona desde Codex en este proyecto.
- La configuración es reproducible y respeta la política de dependencias.
- No aumenta el bundle de producción ni se despliega con la aplicación.
- Se ha probado al menos la validación de la configuración del gráfico nutricional existente.
