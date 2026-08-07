---
Nombre: Corregir cálculo de objetivos nutricionales
Estado: Pendiente
Resumen: Diagnosticar y corregir el error observado entre getIntakeJoinIngredientOnlyValues() y loadObjectiveSumByDate() al cargar datos nutricionales.
Decisiones: ""
Bloqueada: []
Fecha de creación: 2026-08-06T17:49:32
Última modificación: 2026-08-06T17:49:32
---

# Corregir cálculo de objetivos nutricionales

## Contexto

Durante la verificación local de la ruta de nutrición se observó un error en el flujo que parte de `getIntakeJoinIngredientOnlyValues()` y termina en `loadObjectiveSumByDate()`. La causa puede estar en la consulta a Supabase, en la forma de los datos recibidos o en su transformación, pero todavía debe confirmarse.

## Criterios de finalización

- La causa raíz está identificada y documentada.
- El cálculo funciona con datos reales y con los casos límite relevantes.
- Existen pruebas que evitan una regresión.
- La interfaz se actualiza mediante Signals y sigue funcionando sin Zone.js.
