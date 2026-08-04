import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainpageComponent} from "@layout/mainpage/mainpage.component";
import {authGuard} from "@core/guards/auth.guard";
import {ROUTES} from "@data/constants/ROUTES";
import {NAVIGATION_ROUTES} from "@core/services/navigate.service"
import {SideNavMenuComponent} from "@layout/side-nav-menu/side-nav-menu.component"

export const routes: Routes = [
  { path: NAVIGATION_ROUTES.auth.module, loadChildren: () => import('@modules/auth/auth.module').then(m => m.AuthModule)},
  {
    path: '',
    component: MainpageComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: SideNavMenuComponent },
      { path: NAVIGATION_ROUTES.nutrition.module, loadChildren: () => import('@modules/nutrition/nutrition.module').then(m => m.NutritionModule)},
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
