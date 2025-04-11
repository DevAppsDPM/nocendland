import {Injectable, signal, WritableSignal} from '@angular/core';
import {ENTITES} from "@data/types/supabase"
import {API} from "@api/interfaces/api"
import {SupabaseService} from "@api/services/supabase.service"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {NUTRITION_INGREDIENT} from "@data/types/llimbro"

@Injectable({
  providedIn: 'root',
  deps: [LoggerService]
})
export class ApiNutritionIngredientService implements API {
  public savingIngredient: WritableSignal<boolean> = signal(false)

  public entity: ENTITES = 'nutrition_ingredient'

  constructor(private supabase: SupabaseService, private logger: LoggerService) {
    this.logger.setConfig(ApiNutritionIngredientService.name, LOGGER_COLORS.API)
  }

  /* READ */

  public async readAllIngredients(): Promise<NUTRITION_INGREDIENT[]> {
    this.logger.log('Reading all ingredients... ')

    const query = await this.supabase.client.from(this.entity).select('*').order('name')

    if (!!query.error) {
      this.logger.error('Error getting ingredients... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from all ingredients... ', query.data)

    return query.data
  }

  public async readIngredientById(ingredientId: number): Promise<NUTRITION_INGREDIENT> {
    this.logger.log('Reading ingredient with id', ingredientId)

    const query = await this.supabase.client.from(this.entity).select('*').eq('id', ingredientId).single()

    if (!!query.error) {
      this.logger.error('Error getting ingredient with id', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from ingredient with id', query.data)

    return query.data
  }

  /* SAVE */
  public async saveIngredient(ingredient: NUTRITION_INGREDIENT): Promise<NUTRITION_INGREDIENT> {
    this.logger.log('Saving ingredient... ', ingredient)
    this.savingIngredient.set(true)

    const update = this.supabase.addIdUserToEntity(ingredient)

    const query = await this.supabase.client.from(this.entity).upsert(update).select().single()
    this.savingIngredient.set(false)

    if (!!query.error) {
      this.logger.error('Error saving ingredient with id', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Ingredient saved successfully.', query.data)

    return query.data
  }

  /* DELETE */

  public async deleteIngredients(ingredients: NUTRITION_INGREDIENT[]) {
    const ingredientIdsToDelete: number[] = ingredients.map(ingredient => ingredient.id)
    this.logger.log('Deleting ingredients... ', ingredientIdsToDelete)

    const query = await this.supabase.client.from(this.entity).delete().in('id', ingredientIdsToDelete)

    if (!!query.error) {
      this.logger.error('Error deleting ingredients... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Deleted ingredient successfully.', query.data)

    return Promise.resolve(query.data)
  }

  // TODO: IMAGENES...
}
