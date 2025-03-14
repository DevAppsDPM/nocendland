import { Injectable } from '@angular/core';
import {API} from "@api/interfaces/api"
import {ENTITES} from "@data/types/supabase"
import {NUTRITION_OBJETIVES_TOTALS} from "@data/types/llimbro"
import {SupabaseService} from "@api/services/supabase.service"
import {CoreService} from "@core/services/core.service"

@Injectable({
  providedIn: 'root'
})
export class ApiNutritionObjectiveTotalsService implements API {
  public entity: ENTITES = 'nutrition_objectives_totals'

  constructor(private supabase: SupabaseService, private core: CoreService) { }

  /**
   * Función para obtener los registros de cada ingrediente con sus gramos consumidos y las cantidades nutritivas por cada 100 gramos.
   * @private
   * @param date
   */
  public async getIntakeJoinIngredientOnlyValues(date: Date): Promise<NUTRITION_OBJETIVES_TOTALS[]> {
    console.log('Leyendo nutrition_objectives_totals de la fecha', date)
    const query = await this.supabase.client.from(this.entity)
      .select('*')
      .eq('date', this.core.getDateStringForDB(date))
      .eq('id_user', this.supabase.user()?.id)

    if (!!query.error) throw new Error(`${query.error}`)

    console.log('Resultado de leer nutrition_objectives_totals', query.data)

    return query.data
  }
}
