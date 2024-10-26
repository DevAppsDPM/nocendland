import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {ROUTES} from "../../data/constants/ROUTES";
import {Router} from "@angular/router";
import {SideNavService} from "@shared/services/layout/side-nav.service";

@Component({
  selector: 'app-side-nav-menu',
  standalone: true,
  imports: [
    MatIcon,
    MatListModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './side-nav-menu.component.html',
  styleUrl: './side-nav-menu.component.scss'
})
export class SideNavMenuComponent {

  public menuItems: SIDE_NAV_MENU_CATEGORIES[] = [
    {
      title: 'Llimbro',
      buttons: [
        { title: 'Ejercicios', description: 'Control básico de ejercicios', icon: 'fitness_center', route: ROUTES.MODULES.LLIMBRO.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.EXERCISES },
        { title: 'Alimentación', description: 'Calorías y control de la comida', icon: 'fastfood', route: ROUTES.MODULES.LLIMBRO.ROUTE + '/' +  ROUTES.MODULES.LLIMBRO.NUTRITION + '/' + ROUTES.MODULES.LLIMBRO.INTAKE.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.INTAKE.VIEW },
      ]
    },
    {
      title: 'Llimbro',
      buttons: [
        { title: 'Ejercicios', description: 'Control básico de ejercicios', icon: 'fitness_center', route: '' },
        { title: 'Alimentación', description: 'Calorías y control de la comida', icon: 'fastfood', route: '' },
      ]
    },
  ]

  constructor(private router: Router, private sideNavService: SideNavService) {}

  public navigate(route: string): void {
    console.log('Navegación a', route) // TODO: cambiar por servicio navigate
    this.router.navigateByUrl(route).finally(() => this.sideNavService.sideNapOpened.set(false))
  }
}

interface SIDE_NAV_MENU_BUTTONS {
  title: string
  description: string
  icon: string
  route: string
}

interface SIDE_NAV_MENU_CATEGORIES {
  title: string
  buttons: SIDE_NAV_MENU_BUTTONS[]
}
