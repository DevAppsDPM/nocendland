import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntakeComponent} from "@modules/nutrition/pages/intake/intake.component"
import {ObjectivesComponent} from "@modules/nutrition/pages/objectives/objectives.component"
import {IngredientsComponent} from "@modules/nutrition/pages/ingredients/ingredients.component"
import {NAVIGATION_ROUTES} from "@core/services/navigate.service"
import {IngredientFormComponent} from "@modules/nutrition/pages/ingredient-form/ingredient-form.component"

const routes: Routes = [
  // Principales
  { path: NAVIGATION_ROUTES.nutrition.children.ingredients, component: IngredientsComponent },
  { path: NAVIGATION_ROUTES.nutrition.children.intakes, component: IntakeComponent },
  { path: NAVIGATION_ROUTES.nutrition.children.objectives, component: ObjectivesComponent },

  // Extras
  { path: NAVIGATION_ROUTES.nutrition.children["ingredient-form"] + '/:id', component: IngredientFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionRoutingModule { }
