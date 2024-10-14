import {Injectable, signal, WritableSignal} from '@angular/core';
import {SupabaseService} from "@api/services/supabase.service";
import {NUTRITION_INGREDIENT} from "@data/types/llimbro";
import {StorageError} from "@supabase/storage-js"

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private tableName: string = 'nutrition_ingredient'

  /**
   * Se utiliza tanto para cuando se está guardando cómo solicitando la imagen a la base de datos.
   */
  public processingImage: WritableSignal<boolean> = signal(false)
  public savingIngredient: WritableSignal<boolean> = signal(false)
  public readingIngredients: WritableSignal<boolean> = signal(false)
  public readingImagesOfIngredients: WritableSignal<boolean> = signal(false)
  public ingredientList: WritableSignal<any[]> = signal([])

  constructor(private supabaseService: SupabaseService) {
  }

  private addIdUserToIngredientObject(ingredientObject: NUTRITION_INGREDIENT): NUTRITION_INGREDIENT {
    return {
      ...ingredientObject,
      id_user: this.supabaseService.user()?.id!
    }
  }

  private getImagePath(ingredient: NUTRITION_INGREDIENT): string {
    return this.tableName + '/' + this.supabaseService.user()?.id + '/' + ingredient.id
  }

  public readIngredients(): void {
    console.log('Reading all ingredients... ')
    this.readingIngredients.set(true)

    this.supabaseService.supabase.from(this.tableName).select('*').then(ingredients => {
      this.ingredientList.set(ingredients.data || [])

      this.readingIngredients.set(false)
    })
  }

  public readIngredientById(ingredientId: number) {
    console.log('Reading ingredient with id', ingredientId)
    return this.supabaseService.supabase.from(this.tableName).select('*').eq('id', ingredientId).single()
  }

  /**
   * INSERT | UPDATE
   * @param ingredient
   */
  public async saveIngredient(ingredient: NUTRITION_INGREDIENT | undefined) {
    if (!ingredient) return

    console.log('Saving ingredient... ', ingredient)
    this.savingIngredient.set(true)

    const update = this.addIdUserToIngredientObject(ingredient)

    const query = await this.supabaseService.supabase.from(this.tableName).upsert(update).select().single()
    this.savingIngredient.set(false)

    return query.data
  }

  public async deleteIngredient(ingredient: NUTRITION_INGREDIENT) {
    console.log('Deleting ingredient... ', ingredient)
    await this.supabaseService.supabase.storage.from(this.tableName).remove([this.getImagePath(ingredient)])
      .then(cosa => console.warn('deleted', cosa))
      .catch(error => console.error(error))
    return this.supabaseService.supabase.from(this.tableName).delete().eq('id', ingredient.id)
  }

  public uploadImage(ingredient: NUTRITION_INGREDIENT | undefined, file: File) {
    if (!ingredient) return
    this.processingImage.set(true)

    console.log('Uploading image to ingredient: ', ingredient)

    return this.supabaseService.uploadImage(this.getImagePath(ingredient), file)
      .then(imageData => imageData)
      .catch(error => console.error('Error image to ingredient: ', ingredient, error))
      .finally(() => this.processingImage.set(false))
  }

  public async readImage(ingredient: NUTRITION_INGREDIENT): Promise<{ data: Blob, error: null } | {
    data: null,
    error: StorageError
  }> {
    this.processingImage.set(true)
    try {
      return await this.supabaseService.readImage(this.getImagePath(ingredient))
    } finally {
      this.processingImage.set(false)
    }
  }

  public async readImages() {
    // this.readingImagesOfIngredients.set(true)

    // Usamos Promise.all para esperar todas las operaciones async dentro del map
    const nuevaLista = await Promise.all(
      this.ingredientList().map(async ingredient => {
        // Esperamos el valor async para cada objeto
        const nuevoValor = await this.readImage(ingredient);

        // Devolvemos el objeto con la propiedad actualizada
        return { ...ingredient, image: URL.createObjectURL(nuevoValor.data!) };
      })
    );

    // Asignamos la nueva lista al signal
    this.ingredientList.set(nuevaLista);

    // this.ingredientList().map(ingredient => {
    //   return { ...ingredient, image: await this.readImage(ingredient).then(data => URL.createObjectURL(data.data!)
    //     )}

        // .then(data => {
        //   if (!data.data) return
        //
        //   ingredient.image = URL.createObjectURL(data.data)
        // })
        // .finally(() => this.readingImagesOfIngredients.set(false))
    // })
  }
}
