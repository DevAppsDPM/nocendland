# AGENTS.md

Este archivo contiene instrucciones obligatorias para cualquier agente que trabaje en este repositorio. Se aplican a todas las tareas y sesiones futuras dentro del proyecto.

## Reglas fundamentales

### 1. pnpm es el único gestor de paquetes permitido

- **NUNCA se debe utilizar `npm` ni `npx`, bajo ninguna circunstancia.**
- **SIEMPRE se debe utilizar `pnpm`** para instalar, eliminar o actualizar dependencias, ejecutar scripts, invocar binarios y gestionar el workspace.
- Los comandos y ejemplos escritos en código, documentación, comentarios, CI o respuestas al usuario deben usar exclusivamente `pnpm` o `pnpm exec`.
- No se debe ejecutar ningún comando que genere o actualice `package-lock.json`.
- Si `pnpm` no está instalado, no funciona o no permite completar una operación, hay que detenerse e informar al usuario. **Está prohibido recurrir a `npm` o `npx` como alternativa.**
- Antes de modificar dependencias o la configuración del gestor de paquetes, se debe respetar la política definida en `pnpm-workspace.yaml`.
- Las versiones nuevas permanecen en cuarentena durante 7 días mediante `minimumReleaseAge`. Una excepción solo puede añadirse para una versión exacta, después de revisar el motivo y con autorización del usuario; nunca se debe excluir un paquete completo o un scope completo por comodidad.
- Los scripts de instalación de dependencias están denegados por defecto. Solo pueden ejecutarlos versiones exactas incluidas con valor `true` en `allowBuilds`, después de revisar el paquete y justificar por qué necesita construir durante la instalación.
- **NUNCA** se debe activar `dangerouslyAllowAllBuilds`, desactivar `strictDepBuilds`, usar `ignoreScripts` como sustituto de la allowlist, ni relajar `blockExoticSubdeps`, `trustPolicy`, `verifyStoreIntegrity` o `strictStorePkgContentCheck` sin autorización expresa del usuario.
- Después de cambiar dependencias se deben ejecutar `pnpm ignored-builds` y `pnpm audit --audit-level high`. No se deben aplicar correcciones automáticas de auditoría sin revisar primero los cambios propuestos.
- `pnpm dlx`, `pnpm create` y la ejecución efímera de paquetes quedan prohibidos salvo autorización expresa y una versión exacta previamente revisada; esos comandos ejecutan código fuera del grafo fijado por `pnpm-lock.yaml`.
- En CI y despliegues se debe instalar siempre con `pnpm install --frozen-lockfile`.

### 2. Angular debe ser zoneless y utilizar Signals

- La aplicación debe funcionar **sin Zone.js**. Todo código nuevo o modificado debe ser compatible con Angular zoneless y no puede depender de Zone.js, `NgZone` ni de ciclos de detección de cambios provocados implícitamente por Zone.js.
- **Signals son el mecanismo obligatorio para gestionar estado reactivo.** No se debe introducir estado reactivo nuevo basado en `BehaviorSubject`, `Subject`, stores externos o patrones que dependan de detección de cambios global.
- Se debe utilizar:
  - `signal()` para estado escribible.
  - `computed()` para estado derivado.
  - `linkedSignal()` cuando un estado escribible dependa de otro y necesite reiniciarse o reconciliarse.
  - `effect()` únicamente para efectos secundarios; no para propagar o duplicar estado que pueda expresarse mediante `computed()`.
- En servicios, los `WritableSignal` deben mantenerse privados siempre que sea posible y exponerse públicamente mediante `asReadonly()`.
- Las actualizaciones de colecciones y objetos almacenados en Signals deben ser inmutables, usando `set()` o `update()`; no se debe mutar silenciosamente el valor actual.
- RxJS solo debe utilizarse cuando el problema sea realmente un flujo de eventos o una API basada en Observables. En los límites con RxJS se deben usar las utilidades oficiales de interoperabilidad, como `toSignal()` y `toObservable()`, manteniendo Signals como representación principal del estado de la aplicación.
- Toda modificación de componentes, servicios, formularios, navegación o acceso a datos debe revisarse expresamente para asegurar que conserva el funcionamiento zoneless y actualiza la interfaz mediante Signals.

## Evolución de estas instrucciones

Estas son las reglas iniciales. El propósito y la arquitectura definitiva del proyecto se documentarán aquí después de la migración a Angular 22 y del refactor planificado. No se debe asumir que la arquitectura actual es la arquitectura objetivo.
