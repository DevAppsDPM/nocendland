# Catálogo técnico

Este índice presenta la superficie pública reutilizable de Nocendland. Antes de crear una nueva primitiva de interfaz se consulta este catálogo y después se abre su implementación, que continúa siendo la fuente de verdad técnica.

Los consumidores importan estas piezas únicamente desde los entrypoints `@shared/ui/*` declarados en TypeScript. Se mantienen separados para conservar los límites lazy. El build comprueba que no haya imports internos, tipos `any`, rutas de propiedades como texto, redefiniciones de `.ui-*` fuera del sistema central ni componentes o servicios sin registrar aquí.

## Interfaz compartida

| Pieza | Propósito y contrato | Ámbito | Fuente |
| --- | --- | --- | --- |
| `AvatarComponent` | Presenta una imagen con estados de carga y recurso alternativo. | Aplicación | `src/app/shared/ui/avatar/avatar.component.ts` |
| `CalendarComponent` | Selecciona fechas y emite la fecha activa. | Aplicación | `src/app/shared/ui/calendar/calendar.component.ts` |
| `CardDataComponent` | Presenta una métrica formada por etiqueta y valor textual o numérico. | Aplicación | `src/app/shared/ui/card-data/card-data.component.ts` |
| `ColumnCenterContainerComponent` | Compone un `TemplateRef` dentro de la columna principal de contenido. | Shell | `src/app/shared/ui/column-center-container/column-center-container.component.ts` |
| `ConfirmDialogComponent` | Vista accesible del diálogo de confirmación; normalmente se consume mediante su servicio. | Aplicación | `src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts` |
| `DataListComponent<T>` | Lista buscable y seleccionable de `DataListItem<T>`; devuelve siempre colecciones del tipo de dominio. | Aplicación | `src/app/shared/ui/data-list/data-list.component.ts` |
| `DialogRef<TResult>` | Referencia tipada para cerrar un diálogo y observar su resultado. | Aplicación | `src/app/shared/ui/dialog/dialog-ref.ts` |
| `DialogService` | Abre componentes en un overlay accesible conservando el inyector del límite lazy. | Aplicación | `src/app/shared/ui/dialog/dialog.service.ts` |
| `DIALOG_DATA` | Token para inyectar datos tipados por el consumidor de un diálogo. | Aplicación | `src/app/shared/ui/dialog/dialog.tokens.ts` |
| `FeatureTabBarComponent` | Dock inferior flotante que presenta los destinos tipados aportados por una feature. | Feature | `src/app/shared/ui/feature-tab-bar/feature-tab-bar.component.ts` |
| `FeatureSwipeNavigationDirective` | Navega entre los destinos adyacentes de una feature reutilizando su misma configuración y evitando controles interactivos. | Feature | `src/app/shared/ui/feature-tab-bar/feature-swipe-navigation.directive.ts` |
| `ProgressViewerComponent` | Presenta progreso y métricas configuradas por el consumidor. | Aplicación | `src/app/shared/ui/progress-viewer/progress-viewer.component.ts` |
| `ConfirmDialogService` | Ofrece confirmaciones semánticas sobre la infraestructura común de diálogos. | Aplicación | `src/app/shared/ui/services/confirm-dialog.service.ts` |
| `CssTokenService` | Lee tokens CSS computados cuando una integración necesita su valor efectivo. | Aplicación | `src/app/shared/ui/theme/css-token.service.ts` |
| `ThemeService` | Gestiona y persiste el tema claro u oscuro como estado Signal. | Aplicación | `src/app/shared/ui/theme/theme.service.ts` |

## Política de evolución

- Se amplía una pieza existente cuando el nuevo caso conserva su responsabilidad y un contrato claro.
- Se crea una pieza nueva cuando representa un patrón estable diferente; debe disponer de un entrypoint `@shared/ui/*` y añadirse a este catálogo en el mismo cambio.
- Las adaptaciones de datos de dominio se realizan en el consumidor. Las primitivas no reciben rutas de propiedades ni conocen modelos de un área.
- Las clases `.ui-*` se declaran exclusivamente en `src/styles/components.scss`; los ajustes contextuales usan clases propias del componente consumidor.
- Una abstracción no puede introducir `any` para aparentar reutilización. Si dos casos todavía no comparten un contrato cohesivo, se mantiene una implementación explícita hasta que el patrón sea estable.
