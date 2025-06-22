import {Injectable, signal, WritableSignal} from '@angular/core';
import {NavigateService, NAVIGATION_ROUTES} from "@core/services/navigate.service"
import {STRING} from "@data/constants/STRING"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {NavigationEnd} from "@angular/router"

/**
 * El footer de esta aplicación se encargará de pintar botónes que servirán para navegar a diferentes pages.
 */
@Injectable({
  providedIn: 'root',
  deps: [LoggerService]
})
export class FooterService {
  public buttons: WritableSignal<FOOTER_BUTTON[]> = signal([])
  public showingFooter: WritableSignal<boolean> = signal(false)

  private _nutritionButtons: FOOTER_BUTTON[] = [
    { icon: 'lunch_dining', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INGREDIENT.NAME, action: () => this.navigate.to('nutrition', 'ingredients')},
    { icon: 'calendar_month', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.INTAKE.NAME, action: () => this.navigate.to('nutrition', 'intakes')},
    { icon: 'analytics', text: STRING.MODULES.LLIMBRO.CHILDREN.NUTRITION.COMPONENTS.OBJECTIVES.NAME, action: () => this.navigate.to('nutrition', 'objectives')},
  ]

  constructor(private logger: LoggerService, private navigate: NavigateService) {
    this.logger.setConfig(FooterService.name, LOGGER_COLORS.FOOTER)
    this.subscribeToNavigateSubjects()
  }

  private subscribeToNavigateSubjects(): void {
    this.navigate.listenerNavigationEnd().subscribe((navigationEnd: NavigationEnd) => {
      const url: string = navigationEnd.url
      this.logger.log('Setting footer configuration for url ', url)
      this.showFooterByUrl(url)
      this.setButtonsByUrl(url)
    })
  }

  /**
   * Por defecto setea false
   * @param url
   */
  public showFooterByUrl(url: string): void {
    // Nutrition
    if (url.includes(NAVIGATION_ROUTES.nutrition.module)) return this.showingFooter.set(true)

    this.showingFooter.set(false)
  }

  /**
   * Por defecto setea []
   * @param url
   */
  public setButtonsByUrl(url: string): void {
    // TODO: HACER EN CONDICIONES
    this._nutritionButtons[0].active = url.includes('ingredients')
    this._nutritionButtons[1].active = url.includes('intakes')
    this._nutritionButtons[2].active = url.includes('objectives')
    // Nutrition
    if (url.includes(NAVIGATION_ROUTES.nutrition.module)) return this.buttons.set(this._nutritionButtons)

    this.buttons.set([])
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
