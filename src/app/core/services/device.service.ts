import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  public isMobile: WritableSignal<boolean> = signal(false)

  constructor() {
    this.checkIfIsMobile()
    window.addEventListener('resize', this.checkIfIsMobile.bind(this))
  }

  // TODO: PONER ALGÚN TIPO DE EJECUCIONES CONTROLADAS DEBOUNCE NO ME SIRVE
  private checkIfIsMobile(): void {
    this.isMobile.set(window.innerWidth < 600);
  }
}
