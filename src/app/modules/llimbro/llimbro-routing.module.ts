import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NutritionComponent} from "./pages/nutrition/nutrition.component";
import {ExercisesComponent} from "./pages/exercises/exercises.component";
import {ROUTES} from "@data/constants/ROUTES";
import {IngredientFormComponent} from "@modules/llimbro/pages/nutrition/components/ingredient/ingredient-form/ingredient-form.component";
import {
  IngredientListComponent
} from "@modules/llimbro/pages/nutrition/components/ingredient/ingredient-list/ingredient-list.component";
import {IntakeComponent} from "@modules/llimbro/pages/nutrition/components/intake/intake.component";
import {ObjectivesComponent} from "@modules/llimbro/pages/nutrition/components/objectives/objectives.component"

const routes: Routes = [
  { path: ROUTES.MODULES.LLIMBRO.EXERCISES, component: ExercisesComponent },
  {
    path: ROUTES.MODULES.LLIMBRO.NUTRITION,
    component: NutritionComponent,
    children: [
      { path: ROUTES.MODULES.LLIMBRO.INGREDIENT_LIST, component: IngredientListComponent },
      { path: ROUTES.MODULES.LLIMBRO.INGREDIENT_FORM + '/:id', component: IngredientFormComponent },
      { path: ROUTES.MODULES.LLIMBRO.INTAKE, component: IntakeComponent },
      { path: ROUTES.MODULES.LLIMBRO.OBJECTIVES, component: ObjectivesComponent },
//      { path: ROUTES.MODULES.LLIMBRO.ROUTE + '/' +  ROUTES.MODULES.LLIMBRO.NUTRITION + '/**', redirectTo: ROUTES.MODULES.LLIMBRO.ROUTE + '/' +  ROUTES.MODULES.LLIMBRO.NUTRITION + '/' + ROUTES.MODULES.LLIMBRO.INTAKE }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LlimbroRoutingModule { }
