---
Nombre: Mejorar edición del horario de entrenamiento
Estado: En curso
Resumen: La nueva experiencia de horario está implementada; Seguimiento usa inputs numéricos precargados para conservar una fila por serie; queda aplicar la migración de la RPC al proyecto Supabase y regenerar sus tipos.
Decisiones: El catálogo se edita en un modo exclusivo con borrador cancelable y guardado transaccional; los enlaces mantienen efecto inmediato; los ejercicios nuevos parten de 12 repeticiones; el selector de presets es exclusivo de Horario y Seguimiento muestra inputs numéricos precargados; el orden existente se manipula mediante una primitiva compartida accesible.
Bloqueada: []
Fecha de creación: 2026-08-11T18:38:34
Última modificación: 2026-08-21T20:26:05
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
- `RepetitionsInputComponent` es una pieza de UI propia de Horario; Seguimiento usa un input numérico precargado con el objetivo del horario para mantener cada serie en una sola fila, editable solo cuando el resultado real cambia.
- Los cambios del día se protegen y restauran al confirmar un descarte.
- La suite completa pasa con 52 pruebas y el build de producción finaliza correctamente.
- La interfaz se verificó en la ruta local con viewport móvil, sin persistir los datos usados durante la comprobación.
- El ajuste de Seguimiento pasa sus 10 pruebas específicas y el build; se comprobó con 17 series a 1280 px y 390 px, sin desbordamiento horizontal ni errores de consola y sin guardar los borradores visuales.

## Pendiente para cierre

- Aplicar la migración al proyecto Supabase conectado.
- Regenerar `database.types.ts` mediante `pnpm run generate-types` y retirar el contrato local transitorio de la RPC.
- Ejecutar una operación real de guardado del catálogo y revisar los advisors de seguridad y rendimiento.
