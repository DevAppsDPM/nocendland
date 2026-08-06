import {Routes} from '@angular/router';
import {authGuard} from '@platform/auth/auth.guard';
import {MainpageComponent} from '@shell/layout/mainpage/mainpage.component';
import {SideNavMenuComponent} from '@shell/layout/side-nav-menu/side-nav-menu.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@platform/auth/auth.routes').then(({AUTH_ROUTES}) => AUTH_ROUTES),
  },
  {
    path: '',
    component: MainpageComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {path: '', component: SideNavMenuComponent, pathMatch: 'full'},
      {
        path: 'llimbro',
        loadChildren: () => import('@areas/llimbro/llimbro.routes').then(({LLIMBRO_ROUTES}) => LLIMBRO_ROUTES),
      },
      {path: 'nutrition', redirectTo: 'llimbro/nutrition', pathMatch: 'full'},
      {path: 'nutrition/ingredients', redirectTo: 'llimbro/nutrition/ingredients', pathMatch: 'full'},
      {path: 'nutrition/intakes', redirectTo: 'llimbro/nutrition/intakes', pathMatch: 'full'},
      {path: 'nutrition/objectives', redirectTo: 'llimbro/nutrition/objectives', pathMatch: 'full'},
      {
        path: 'nutrition/ingredient-form/:id',
        redirectTo: ({params}) => `llimbro/nutrition/ingredient-form/${params['id']}`,
        pathMatch: 'full',
      },
    ],
  },
  {path: '**', redirectTo: ''},
];
