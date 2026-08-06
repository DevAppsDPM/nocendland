import {Component, ChangeDetectionStrategy} from '@angular/core';

import {SideNavService} from "@shell/state/side-nav.service";
import {NavigationService} from "@shell/navigation/navigation.service"

@Component({
    selector: 'app-side-nav-menu',
  imports: [],
    templateUrl: './side-nav-menu.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './side-nav-menu.component.scss'
})
export class SideNavMenuComponent {
  readonly menuItems: SideNavCategory[] = [
    {
      title: 'Llimbro',
      buttons: [
        {title: 'Ejercicios', description: 'Control básico de ejercicios', icon: 'fitness_center', action: () => this.open('training', 'exercises')},
        {title: 'Alimentación', description: 'Calorías y control de la comida', icon: 'fastfood', action: () => this.open('nutrition')},
      ],
    },
  ]

  constructor(private navigation: NavigationService, private sideNav: SideNavService) {}

  private async open(route: 'nutrition' | 'training', child?: 'exercises'): Promise<void> {
    if (route === 'training') await this.navigation.to('training', child ?? 'exercises')
    else await this.navigation.to('nutrition')
    this.sideNav.close()
  }

}

interface SideNavButton {
  title: string
  description: string
  icon: string
  action: () => any
}

interface SideNavCategory {
  title: string
  buttons: SideNavButton[]
}
