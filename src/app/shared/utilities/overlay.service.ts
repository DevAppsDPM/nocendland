import {Injectable, InjectionToken, Injector} from '@angular/core';
import {ComponentPortal} from "@angular/cdk/portal";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";

/**
 * Ejemplo de uso:
 * ````
 *   public overlayComponente(): void {
 *     const config: CORE_OVERLAY_CONFIG = {
 *       component: OverlayComponent,
 *       componentConfig: {test: 'test overlay'},
 *     }
 *
 *     this.coreService.overlay.show(config)
 *     setTimeout(() => this.coreService.overlay.hide(), 1000)
 *   }
 * ````
 */
@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  private overlayRefs: Record<string, OverlayRef> = {}

  constructor(private overlay: Overlay) { }

  public show( config: CORE_OVERLAY_CONFIG ): void { // TODO: Quizás si este método devuelve el overlay se pueden hacer cositas desde donde se llama.
    let overlayRef = this.createOverlay(config)
    if (!overlayRef) return

    let injeccion = Injector.create( { providers: [ { provide:  config.provider || CORE_OVERLAY_INYECTOR_TOKEN, useValue: config.componentConfig } ] } )

    const portal = new ComponentPortal(config?.component, null, injeccion)

    overlayRef.attach(portal)
  }

  public hide(config: CORE_OVERLAY_CONFIG): void {
    if (!this.overlayRefs[config.component.name]) return
    this.overlayRefs[config.component.name].detach()
    delete this.overlayRefs[config.component.name]
  }

  private createOverlay(config: CORE_OVERLAY_CONFIG): OverlayRef | null {
    if (!!this.overlayRefs[config.component.name]) {
      console.warn(`Overlay ref ${config.component.name} ya existe`)
      return null
    }

    let overlay = this.overlay.create()
    this.overlayRefs[config.component.name] = overlay
    return overlay
  }
}

export type CORE_OVERLAY_CONFIG = {
  /** Este es el componente que el overlay mostrará. */
  component: any
  /**
   * Configuración del componente, para utilizarlo necesitarás que tu componente tenga un constructor con:
   * ````
   *   import {CORE_OVERLAY_INYECTOR_TOKEN} from "itb-core/lib/core-types";
   *
   *   constructor(@Inject(CORE_OVERLAY_INYECTOR_TOKEN) config: any) {
   *     console.log('config', config);
   *   }
   * ````
   */
  componentConfig?: any
  /** Si tu componente necesita un InjectionToken especial puedes pasarlo por aquí. Para componentes normalitos no hace falta pasarlo. */
  provider?: InjectionToken<any>
}

export const CORE_OVERLAY_INYECTOR_TOKEN = new InjectionToken<any>('CORE_OVERLAY_INYECTOR_TOKEN');
