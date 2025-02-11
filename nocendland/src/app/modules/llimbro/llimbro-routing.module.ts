import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NutritionComponent} from "./pages/nutrition/nutrition.component";
import {ExercisesComponent} from "./pages/exercises/exercises.component";
import {ROUTES} from "@data/constants/ROUTES";
import {IngredientFormComponent} from "@modules/llimbro/pages/nutrition/components/ingredient/ingredient-form/ingredient-form.component";
import {IntakeComponent} from "@modules/llimbro/pages/nutrition/components/intake/intake.component";
import {ObjectivesComponent} from "@modules/llimbro/pages/nutrition/components/objectives/objectives.component"
import { IngredientComponent } from './pages/nutrition/components/ingredient/ingredient.component';
import { IngredientsComponent } from './pages/nutrition/components/ingredient/ingredients/ingredients.component';
import { SelectIngredientsComponent } from './pages/nutrition/components/intake/select-ingredients/select-ingredients.component';
import { IntakesViewComponent } from './pages/nutrition/components/intake/intakes-view/intakes-view.component';
import {
  ObjectiveConfigComponent
} from "@modules/nutrition/pages/objective-config/objective-config.component"

const routes: Routes = [
  { path: ROUTES.MODULES.LLIMBRO.EXERCISES, component: ExercisesComponent },
  {
    path: ROUTES.MODULES.LLIMBRO.NUTRITION,
    component: NutritionComponent,
    children: [
      {
        // INGREDIENTS
        path: ROUTES.MODULES.LLIMBRO.INGREDIENT.ROUTE, component: IngredientComponent, children:
        [
          { path: ROUTES.MODULES.LLIMBRO.INGREDIENT.INGREDIENT_LIST, component: IngredientsComponent },
          { path: ROUTES.MODULES.LLIMBRO.INGREDIENT.INGREDIENT_FORM + '/:id', component: IngredientFormComponent },
        ]
      },
      {
        // INTAKES
        path: ROUTES.MODULES.LLIMBRO.INTAKE.ROUTE, component: IntakeComponent, children:
        [
          { path: ROUTES.MODULES.LLIMBRO.INTAKE.VIEW, component: IntakesViewComponent },
          { path: ROUTES.MODULES.LLIMBRO.INTAKE.SELECT_INGREDIENTS, component: SelectIngredientsComponent }
        ]
      },
      {
        // OBJETIVES
        path: ROUTES.MODULES.LLIMBRO.OBJECTIVES.ROUTE, component: ObjectivesComponent, children:
        [
          { path: ROUTES.MODULES.LLIMBRO.OBJECTIVES.CONFIG, component: ObjectiveConfigComponent }
        ]
      },
//      { path: ROUTES.MODULES.LLIMBRO.ROUTE + '/' +  ROUTES.MODULES.LLIMBRO.NUTRITION + '/**', redirectTo: ROUTES.MODULES.LLIMBRO.ROUTE + '/' +  ROUTES.MODULES.LLIMBRO.NUTRITION + '/' + ROUTES.MODULES.LLIMBRO.INTAKE }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LlimbroRoutingModule { }
