import {computed, inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationService} from '@shell/navigation/navigation.service';

@Injectable({providedIn: 'root'})
export class FooterService {
  private readonly navigation = inject(NavigationService)
  private readonly navigationEvent = toSignal(this.navigation.navigationEnd(), {initialValue: null})

  readonly showingFooter = computed(() => this.navigation.isNutritionUrl(this.currentUrl()))
  readonly buttons = computed<FooterButton[]>(() => {
    const url = this.currentUrl()
    if (!this.navigation.isNutritionUrl(url)) return []

    return [
      {icon: 'lunch_dining', text: 'Alimentos', active: url.includes('/ingredients'), action: () => this.navigation.to('nutrition', 'ingredients')},
      {icon: 'calendar_month', text: 'Ingesta', active: url.includes('/intakes'), action: () => this.navigation.to('nutrition', 'intakes')},
      {icon: 'analytics', text: 'Objetivos', active: url.includes('/objectives'), action: () => this.navigation.to('nutrition', 'objectives')},
    ]
  })

  public onClickButton(button: FooterButton): void {
    void button.action()
  }

  private currentUrl(): string {
    return this.navigationEvent()?.urlAfterRedirects ?? this.navigation.currentUrl()
  }
}

export type FooterButton = {
  icon: string
  text: string
  action: () => Promise<boolean>
  active: boolean
}
