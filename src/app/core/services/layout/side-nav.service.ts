import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  public sideNapOpened: WritableSignal<boolean> = signal(false)
  constructor() { }

  public toggle(): void {
    this.sideNapOpened.set(!this.sideNapOpened())
  }
}
