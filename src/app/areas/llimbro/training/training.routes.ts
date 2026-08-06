import {Routes} from '@angular/router';

export const TRAINING_ROUTES: Routes = [
  {path: '', redirectTo: 'exercises', pathMatch: 'full'},
  {
    path: 'exercises',
    loadComponent: () => import('./pages/exercises/exercises.component').then(({ExercisesComponent}) => ExercisesComponent),
  },
];
