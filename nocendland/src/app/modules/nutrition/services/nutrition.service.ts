import {effect, Injectable, signal, untracked, WritableSignal} from '@angular/core';
import {ROUTES} from "@data/constants/ROUTES"
import {IngredientService} from "@modules/nutrition/services/ingredient.service"
import {
  NUTRITION_INGREDIENT,
  NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT, NUTRITION_OBJECTIVE,
  NUTRITION_OBJETIVES_TOTALS
} from "@data/types/llimbro"
import {ApiNutritionObjectiveTotalsService} from "@api/services/api-nutrition-objective-totals.service"
import {ApiNutritionIngredientService} from "@api/services/api-nutrition-ingredient.service"
import {ApiNutritionIntakeService} from "@api/services/api-nutrition-intake.service"
import {ApiNutritionObjetiveService} from "@api/services/api-nutrition-objetive.service"

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  public dateSelected: WritableSignal<Date> = signal(new Date())

  // Ingredients
  public ingredientList: WritableSignal<NUTRITION_INGREDIENT[]> = signal([])
  public loadingIngredientList: WritableSignal<boolean> = signal(false)

  // Intakes
  public intakeJoinIngredientList: WritableSignal<NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]> = signal([])
  public loadingIntakeJoinIngredientList: WritableSignal<boolean> = signal(false)

  // Objectives
  public objectiveList: WritableSignal<NUTRITION_OBJECTIVE[]> = signal([])
  public loadingObjectiveList: WritableSignal<boolean> = signal(false)

  public objectives: WritableSignal<NUTRITION_OBJETIVES_TOTALS | undefined> = signal(undefined)

  constructor(
    private apiNutritionIngredient: ApiNutritionIngredientService,
    private apiNutritionIntake: ApiNutritionIntakeService,
    private apiNutritionObjective: ApiNutritionObjetiveService,
    private apiNutritionObjetiveTotals: ApiNutritionObjectiveTotalsService,
  ) {
    this.effectDateSelected()
    this.loadIngredientList()
    this.loadObjectiveList()
  }

  public reloadDateSelectedDependent(): void {
    this.loadObjectiveSumByDate()
    this.loadIntakeJoinIngredientList()
  }

  /* INGREDIENTS */

  public loadIngredientList(): void {
    this.loadingIngredientList.set(true)
    this.apiNutritionIngredient.readAllIngredients()
      .then((ingredientList: NUTRITION_INGREDIENT[]) => this.ingredientList.set(ingredientList))
      .finally(() => this.loadingIngredientList.set(false))
  }

  /* INTAKES */
  public loadIntakeJoinIngredientList(): void {
    this.loadingIntakeJoinIngredientList.set(true)
    this.apiNutritionIntake.readIntakesJoinIngredientByDate(this.dateSelected())
      .then((intakeList: NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]) => this.intakeJoinIngredientList.set(intakeList))
      .finally(() => this.loadingIntakeJoinIngredientList.set(false))
  }

  public async loadObjectiveSumByDate(): Promise<void> {
    let totals: NUTRITION_OBJETIVES_TOTALS = {
      calories: 0,
      carbohydrates: 0,
      fats: 0,
      proteins: 0,
      date: '',
      id_user: ''
    }

    const values = await this.apiNutritionObjetiveTotals.getIntakeJoinIngredientOnlyValues(this.dateSelected())
    values.map(value => {
      totals.calories! += value.calories || 0
      totals.carbohydrates! += value.carbohydrates || 0
      totals.fats! += value.fats || 0
      totals.proteins! += value.proteins || 0
    })

    this.objectives.set(totals)
  }

  /* OBJECTIVES */
  public loadObjectiveList(): void {
    this.loadingObjectiveList.set(true)
    this.apiNutritionObjective.readObjectives()
      .then((objectiveList: NUTRITION_OBJECTIVE[]) => this.objectiveList.set(objectiveList))
      .finally(() => this.loadingObjectiveList.set(false))
  }

  /* EFFECTS */
  private effectDateSelected(): void {
    effect(() => {
      this.dateSelected()

      untracked(() => {
        this.reloadDateSelectedDependent()
      })
    })
  }
}
