import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {NgIf} from "@angular/common";
import {ROUTES} from "../../data/constants/ROUTES";
import {Router} from "@angular/router";
import {SideNavService} from "@core/services/layout/side-nav.service";
import {NavigateService} from "@core/services/navigate.service"

@Component({
    selector: 'app-side-nav-menu',
  imports: [
    MatIcon,
    MatListModule,
    NgIf
  ],
    templateUrl: './side-nav-menu.component.html',
    styleUrl: './side-nav-menu.component.scss'
})
export class SideNavMenuComponent {
  public menuItems: SIDE_NAV_MENU_CATEGORIES[] = []
  constructor(private navigate: NavigateService, private sideNavService: SideNavService) {
    this.menuItems = [
      {
        title: 'Llimbro',
        buttons: [
          { title: 'Ejercicios', description: 'Control básico de ejercicios', icon: 'fitness_center', action: () => Promise.resolve() },
          { title: 'Alimentación', description: 'Calorías y control de la comida', icon: 'fastfood', action: () =>  this.navigate.to('nutrition').finally(() => this.sideNavService.sideNapOpened.set(false)) },
        ]
      }
    ]
  }

}

interface SIDE_NAV_MENU_BUTTONS {
  title: string
  description: string
  icon: string
  action: () => any
}

interface SIDE_NAV_MENU_CATEGORIES {
  title: string
  buttons: SIDE_NAV_MENU_BUTTONS[]
}
