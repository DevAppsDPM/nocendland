import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExercisesComponent} from "./pages/exercises/exercises.component";
import {ROUTES} from "@data/constants/ROUTES";
import {IngredientFormComponent} from "@modules/nutrition/pages/ingredient-form/ingredient-form.component";
import {IntakeComponent} from "@modules/nutrition/pages/intake/intake.component";
import {ObjectivesComponent} from "@modules/nutrition/pages/objectives/objectives.component"
import { IngredientsComponent } from '@modules/nutrition/pages/ingredients/ingredients.component';
import { SelectIngredientsComponent } from '@modules/nutrition/components/select-ingredients/select-ingredients.component';
import {
  ObjectiveConfigComponent
} from "@modules/nutrition/pages/objective-config/objective-config.component"

const routes: Routes = []
// const routes: Routes = [
//   { path: ROUTES.MODULES.LLIMBRO.EXERCISES, component: ExercisesComponent },
//   {
//     path: ROUTES.MODULES.LLIMBRO.NUTRITION,
//     component: NutritionComponent,
//     children: [
//       {
//         // INGREDIENTS
//         // path: ROUTES.MODULES.LLIMBRO.INGREDIENT.ROUTE, component: IngredientComponent, children:
//         // [
//         //   { path: ROUTES.MODULES.LLIMBRO.INGREDIENT.INGREDIENT_LIST, component: IngredientsComponent },
//         //   { path: ROUTES.MODULES.LLIMBRO.INGREDIENT.INGREDIENT_FORM + '/:id', component: IngredientFormComponent },
//         // ]
//       },
//       {
//         // INTAKES
//         path: ROUTES.MODULES.LLIMBRO.INTAKE.ROUTE, component: IntakeComponent, children:
//         [
//           { path: ROUTES.MODULES.LLIMBRO.INTAKE.VIEW, component: IntakesViewComponent },
//           { path: ROUTES.MODULES.LLIMBRO.INTAKE.SELECT_INGREDIENTS, component: SelectIngredientsComponent }
//         ]
//       },
//       {
//         // OBJETIVES
//         path: ROUTES.MODULES.LLIMBRO.OBJECTIVES.ROUTE, component: ObjectivesComponent, children:
//         [
//           { path: ROUTES.MODULES.LLIMBRO.OBJECTIVES.CONFIG, component: ObjectiveConfigComponent }
//         ]
//       },
// //      { path: ROUTES.MODULES.LLIMBRO.ROUTE + '/' +  ROUTES.MODULES.LLIMBRO.NUTRITION + '/**', redirectTo: ROUTES.MODULES.LLIMBRO.ROUTE + '/' +  ROUTES.MODULES.LLIMBRO.NUTRITION + '/' + ROUTES.MODULES.LLIMBRO.INTAKE }
//     ]
//   },
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LlimbroRoutingModule { }
