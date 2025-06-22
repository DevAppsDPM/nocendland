import {Injectable, signal, WritableSignal} from '@angular/core';
import {ENTITES} from "@data/types/supabase"
import {API} from "@api/interfaces/api"
import {SupabaseService} from "@api/services/supabase.service"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {NUTRITION_INGREDIENT} from "@data/types/llimbro"
import {ApiBucketService} from "@api/services/api-bucket.service"

@Injectable({
  providedIn: 'root',
  deps: [LoggerService]
})
export class ApiNutritionIngredientService implements API {
  public savingIngredient: WritableSignal<boolean> = signal(false)
  public savingIngredientImage: WritableSignal<boolean> = signal(false)

  public entity: ENTITES = 'nutrition_ingredient'

  constructor(private supabase: SupabaseService, private logger: LoggerService, private apiBucket: ApiBucketService) {
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

  /* IMAGE */

  /**
   * Devuelve la imagen de un ingrediente por su ID.
   * Lo carga desde el bucket de Supabase teniendo en cuenta la entidad y el usuario
   * @param ingredientId
   */
  public async readIngredientImageById(ingredientId: number) {
    this.logger.log('Reading ingredient image with id', ingredientId)

    const query = await this.apiBucket.readImage(`${this.entity}/${this.supabase.user()?.id}/${ingredientId}`)

    if (!!query.error) {
      this.logger.error('Error getting ingredient image with id', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from ingredient image with id', query.data)

    return query.data
  }

  /**
   * Lee todas las imágenes de los ingredientes del usuario actual.
   */
  public async readIngredientImageList() {
    this.logger.log('Reading all images of ingredients... ')

    const query = await this.apiBucket.readImages(`${this.entity}/${this.supabase.user()?.id}/`)

    if (!!query.error) {
      this.logger.error('Error getting images of ingredients... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from all images of ingredients... ', query.data)

    return query.data
  }

  public async saveIngredientImage(ingredient: NUTRITION_INGREDIENT | undefined, file: File) {
    if (!ingredient) return
    this.savingIngredientImage.set(true)

    console.log('Uploading image to ingredient: ', ingredient)

    return await this.apiBucket.uploadImage(`${this.entity}/${this.supabase.user()?.id}/${ingredient.id}`, file)
      .then(imageData => imageData)
      .catch(error => console.error('Error image to ingredient: ', ingredient, error))
    .finally(() => this.savingIngredientImage.set(false))
  }
}
