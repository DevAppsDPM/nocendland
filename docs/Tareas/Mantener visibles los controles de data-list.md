---
Nombre: Mantener visibles los controles de data-list
Estado: Hecha
Resumen: DataList limita su altura al viewport utilizable y desplaza únicamente sus elementos, manteniendo visibles la búsqueda y la confirmación en todos sus consumidores.
Decisiones: Solo el contenido de la lista será desplazable; toolbar y footer ocuparán filas fijas; se conservará la API pública y se limitará la altura al viewport utilizable cuando el consumidor no la acote.
Bloqueada: []
Fecha de creación: 2026-08-12T16:58:00+02:00
Última modificación: 2026-08-12T17:08:00+02:00
---

# Mantener visibles los controles de data-list

## Objetivo

Mejorar la experiencia de las listas largas haciendo que la barra de herramientas y el botón de confirmación permanezcan visibles mientras los elementos se desplazan dentro de la lista.

## Criterios de finalización

- Solo el contenedor de elementos gestiona el desplazamiento vertical.
- La barra de herramientas y el pie de confirmación permanecen dentro del área visible.
- La lista aprovecha la altura disponible en Nutrición y Entrenamiento y dispone de un límite seguro basado en el viewport.
- El comportamiento se verifica con listas largas, cortas y vacías, tanto en escritorio como en móvil.
- La API `DataListConfig` y su estado basado en Signals no cambian.

## Verificación

- `pnpm test -- --watch=false`: 72 pruebas correctas.
- `pnpm run build`: correcto; permanecen los avisos conocidos de presupuesto inicial y estilos sin superar sus máximos de error.
- Verificación real en escritorio y 390 × 844 de Alimentos, Ingestas, Ejercicios, Horario y Seguimiento.
- En Horario, el layout se desplaza al abrir el selector y mantiene la toolbar y Confirmar por encima de la navegación inferior.
- No se observaron errores de consola durante la comprobación visual.

## Resultado

- `DataListComponent` compone toolbar, contenido desplazable y footer en tres filas, con un límite basado en el viewport y las áreas seguras.
- La cadena de alturas se completa en la shell de contenido, los layouts de Nutrición/Entrenamiento y las páginas que alojan listas a pantalla completa.
- Los layouts de feature gestionan el scroll de las páginas normales; las listas largas desplazan exclusivamente sus elementos.
- Horario alinea automáticamente el selector al entrar en modo selección para evitar que la navegación inferior tape la confirmación.
- La API `DataListConfig` y el estado basado en Signals permanecen intactos.
