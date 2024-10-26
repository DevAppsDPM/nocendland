import {Injectable, signal, WritableSignal} from '@angular/core';
import {Router} from "@angular/router"

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  public buttons: WritableSignal<FOOTER_BUTTON[]> = signal([])
  public showingFooter: WritableSignal<boolean> = signal(false)

  constructor(private router: Router) { }

  public navigate(route: string): void {
    this.router.navigateByUrl(route)
  }

  public onClickButton(button: FOOTER_BUTTON): void {
    this.buttons().map(button => button.active = false)
    button.active = true
    button.action()
  }
}

export type FOOTER_BUTTON = {
  icon: string
  text: string
  action: () => void
  active?: boolean
}
