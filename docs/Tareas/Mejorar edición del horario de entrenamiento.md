---
Nombre: Mejorar edición del horario de entrenamiento
Estado: En curso
Resumen: La nueva experiencia de horario está implementada y verificada en frontend; queda aplicar la migración de la RPC al proyecto Supabase y regenerar sus tipos para cerrar la tarea.
Decisiones: El catálogo se edita en un modo exclusivo con borrador cancelable y guardado transaccional; los enlaces mantienen efecto inmediato; los ejercicios nuevos parten de 12 repeticiones; el orden existente se manipula mediante una primitiva compartida accesible.
Bloqueada: []
Fecha de creación: 2026-08-11T18:38:34
Última modificación: 2026-08-11T21:30:00
---

# Mejorar edición del horario de entrenamiento

## Objetivo

Hacer que la operativa diaria del horario priorice la asignación y configuración de ejercicios, relegando la administración del catálogo a un modo explícito y añadiendo atajos y ordenación accesible.

## Criterios de finalización

- El botón para añadir ejercicios pertenece a la cabecera del día seleccionado.
- El catálogo colapsado solo muestra selector, estado y acceso a edición.
- Los cambios del catálogo se guardan de forma atómica o se cancelan sin efectos.
- Los ejercicios nuevos parten de 12 repeticiones y admiten presets 8, 10 y 12 además de entrada manual.
- Las tarjetas se pueden ordenar con puntero, tacto y teclado, persistiendo `sort_order` al guardar el día.
- Los cambios sin guardar se protegen antes de abandonar el día o entrar en edición del catálogo.
- Pruebas, comprobaciones compartidas y build quedan verificados.

## Resultado actual

- El catálogo dispone de un modo exclusivo con borrador Signal y guardado atómico preparado mediante `save_training_schedule_catalog`.
- Las tarjetas incluyen presets de repeticiones y una lista reordenable accesible compartida.
- `RepetitionsInputComponent` es una pieza de UI propia de Entrenamiento y se reutiliza en Horario y Seguimiento; conserva presets, entrada manual y etiquetas visibles para completar cada serie.
- Los cambios del día se protegen y restauran al confirmar un descarte.
- La suite completa pasa con 52 pruebas y el build de producción finaliza correctamente.
- La interfaz se verificó en la ruta local con viewport móvil, sin persistir los datos usados durante la comprobación.

## Pendiente para cierre

- Aplicar la migración al proyecto Supabase conectado.
- Regenerar `database.types.ts` mediante `pnpm run generate-types` y retirar el contrato local transitorio de la RPC.
- Ejecutar una operación real de guardado del catálogo y revisar los advisors de seguridad y rendimiento.
