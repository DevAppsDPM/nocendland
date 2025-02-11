import { Injectable } from '@angular/core';
import {ROUTES} from "@data/constants/ROUTES"
import {IngredientService} from "@modules/nutrition/services/ingredient.service"

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  constructor(public ingredient: IngredientService) {
  }
  public routeBase(): string {
    return ROUTES.MODULES.LLIMBRO.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.NUTRITION + '/'
  }
}
