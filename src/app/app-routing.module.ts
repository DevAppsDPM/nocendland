import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainpageComponent} from "@layout/mainpage/mainpage.component";
import {authGuard} from "@core/guards/auth.guard";
import {ROUTES} from "@data/constants/ROUTES";

export const routes: Routes = [
  { path: ROUTES.MODULES.AUTH.ROUTE, loadChildren: () => import('@modules/auth/auth.module').then(m => m.AuthModule)},
  {
    path: '',
    component: MainpageComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: ROUTES.MODULES.LLIMBRO.ROUTE, loadChildren: () => import('@modules/llimbro/llimbro.module').then(m => m.LlimbroModule)},
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
