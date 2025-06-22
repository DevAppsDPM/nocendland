import {effect, Injectable, signal, untracked, WritableSignal} from '@angular/core';
import {
  NUTRITION_INGREDIENT,
  NUTRITION_INGREDIENT_IMAGE,
  NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT,
  NUTRITION_OBJECTIVE,
  NUTRITION_OBJETIVES_TOTALS
} from "@data/types/llimbro"
import {ApiNutritionObjectiveTotalsService} from "@api/services/api-nutrition-objective-totals.service"
import {ApiNutritionIngredientService} from "@api/services/api-nutrition-ingredient.service"
import {ApiNutritionIntakeService} from "@api/services/api-nutrition-intake.service"
import {ApiNutritionObjetiveService} from "@api/services/api-nutrition-objetive.service"
import {ResourcesService} from "@core/services/resources.service"

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  public dateSelected: WritableSignal<Date> = signal(new Date())

  // Ingredients
  public ingredientList: WritableSignal<NUTRITION_INGREDIENT[]> = signal([])
  public ingredientImageList: WritableSignal<NUTRITION_INGREDIENT_IMAGE[]> = signal([])
  public loadingIngredientList: WritableSignal<boolean> = signal(false)

  // Intakes
  public intakeJoinIngredientList: WritableSignal<NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]> = signal([])
  public loadingIntakeJoinIngredientList: WritableSignal<boolean> = signal(false)
  public savingIntakeJoinIngredientList: WritableSignal<boolean> = signal(false)

  // Objectives
  public objectiveList: WritableSignal<NUTRITION_OBJECTIVE[]> = signal([])
  public loadingObjectiveList: WritableSignal<boolean> = signal(false)

  public objectives: WritableSignal<NUTRITION_OBJETIVES_TOTALS | undefined> = signal(undefined)

  constructor(
    private apiNutritionIngredient: ApiNutritionIngredientService,
    private apiNutritionIntake: ApiNutritionIntakeService,
    private apiNutritionObjective: ApiNutritionObjetiveService,
    private apiNutritionObjetiveTotals: ApiNutritionObjectiveTotalsService,
    private resources: ResourcesService
  ) {
    this.effectDateSelected()
    this.loadIngredientList()
    this.loadObjectiveList()
  }

  public async reloadDateSelectedDependent(): Promise<void> {
    await Promise.all([
      this.loadObjectiveSumByDate(),
      this.loadIntakeJoinIngredientList()
    ])
  }

  /* INGREDIENTS */

  public loadIngredientList(): void {
    this.loadingIngredientList.set(true)
    this.apiNutritionIngredient.readAllIngredients()
      .then((ingredientList: NUTRITION_INGREDIENT[]) => this.ingredientList.set(ingredientList))
      // .then(() => this.syncIngredientImageList())
      .finally(() => this.loadingIngredientList.set(false))
  }

  // private async syncIngredientImageList(): Promise<void> {
  //   // Carga la lista de imágenes desde la API
  //   const loadedImages: any[] = await this.apiNutritionIngredient.readIngredientImageList();
  //   const currentList = this.ingredientImageList();
  //   let updatedList: NUTRITION_INGREDIENT_IMAGE[] = [...currentList];
  //
  //   // Añade los nuevos elementos que no existen en ingredientImageList
  //   loadedImages.forEach(loaded => {
  //     const exists = currentList.some(img => img.ingredientId === loaded.name);
  //     if (!exists) {
  //       updatedList.push({
  //         ingredientId: loaded.name,
  //         lastModified: loaded.metadata.lastModified,
  //         src: undefined // Se cargará después si es necesario
  //       });
  //     }
  //   });
  //
  //   // Array de promesas para cargar imágenes en paralelo
  //   const promises = updatedList.map(async img => {
  //     const loaded = loadedImages.find(l => l.name === img.ingredientId);
  //     if (!loaded) return img;
  //
  //     if (!img.src || img.lastModified !== loaded.metadata.lastModified) {
  //       const src = await this.apiNutritionIngredient.readIngredientImageById(img.ingredientId);
  //       return {
  //         ...img,
  //         src,
  //         lastModified: loaded.metadata.lastModified
  //       };
  //     }
  //     return img;
  //   });
  //
  //   updatedList = await Promise.all(promises);
  //
  //   this.ingredientImageList.set(updatedList);
  //   this.updateIngredientListWithImages()
  // }
  //
  // private updateIngredientListWithImages(): void {
  //   // Recuperar la lista de ingredientes y la lista de imágenes
  //   const ingredients = this.ingredientList();
  //   const images = this.ingredientImageList();
  //
  //   // Actualizar la lista de ingredientes con las imágenes correspondientes
  //   const updatedList = ingredients.map(ingredient => {
  //     const imageObj = images.find(img => img.ingredientId == ingredient.id);
  //     return {
  //       ...ingredient,
  //       image: imageObj?.src ? URL.createObjectURL(imageObj.src) : this.resources.getRandomDefaultImageForIngredient()
  //     };
  //   });
  //
  //   this.ingredientList.set(updatedList);
  // }

  /* INTAKES */
  public async loadIntakeJoinIngredientList(): Promise<void> {
    this.loadingIntakeJoinIngredientList.set(true)
    return this.apiNutritionIntake.readIntakesJoinIngredientByDate(this.dateSelected())
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
