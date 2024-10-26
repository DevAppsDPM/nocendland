import { Injectable } from '@angular/core';
import { SupabaseService } from '@app/api/services/supabase.service';
import { NUTRITION_INTAKE, NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT } from '@app/data/types/llimbro';
import { supabaseService } from '@app/data/types/supabase';
import { IngredientService } from './ingredient.service';


@Injectable({
  providedIn: 'root'
})
export class IntakeService extends supabaseService {
  tableName: string = 'nutrition_intake'

  constructor(protected override supabaseService: SupabaseService, private ingredientService: IngredientService) {
    super(supabaseService)
  }

  public async readIntakesByDate(date: Date): Promise<NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]> {
    const select: string = `*, ${this.ingredientService.tableName}(*)` // TODO: Ver si se puede utilizar este select de alguna manera, ahora mismo si no se le pasa a select() el argumento directamente el string da un error raro.
    const query = await this.supabaseService.supabase.from(this.tableName).select('*, nutrition_ingredient(*)').eq('date', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())

    if (!query.data) return Promise.reject(query.error)

    console.log('NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]', query.data)
      
    return query.data
  }

  public async saveIntake(intake: NUTRITION_INTAKE) {
    intake = this.supabaseService.addIdUserToEntity(intake)
    const query = await this.supabaseService.supabase.from(this.tableName).upsert({date: new Date(), ingredient: 77, quantity_in_grams: 3, id_user: 'd142ee21-e490-4552-afa3-9489990d00ed'}).select().single()

    return query.data
  }

  public async saveIntakes(intakes: NUTRITION_INTAKE[]) {
    intakes = this.supabaseService.addIdUserToEntites(intakes)
    const query = await this.supabaseService.supabase.from(this.tableName).upsert(intakes).select()

    return query.data
  }
  
}
