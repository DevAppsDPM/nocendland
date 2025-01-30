import {Injectable} from '@angular/core';
import {SupabaseService} from "@api/services/supabase.service"
import {supabaseService} from "@data/types/supabase"
import {NUTRITION_OBJETIVES_TOTALS} from "@data/types/llimbro"

@Injectable({
  providedIn: 'root'
})
export class ObjectivesService extends supabaseService {
  tableName: string = 'nutrition_objective' // TODO QUITAR tableName

  constructor(protected override supabaseService: SupabaseService) {
    super(supabaseService)
  }

  /**
   * @param date
   */
  public async readObjectiveSumByDate(date: Date): Promise<NUTRITION_OBJETIVES_TOTALS> {
    try {
      let totals: NUTRITION_OBJETIVES_TOTALS = {
        calories: 0,
        carbohydrates: 0,
        fats: 0,
        proteins: 0,
        date: ''
      }

      const values = await this.getIntakeJoinIngredientOnlyValues(date)
      values.map(value => {
        totals.calories! += value.calories || 0
        totals.carbohydrates! += value.carbohydrates || 0
        totals.fats! += value.fats || 0
        totals.proteins! += value.proteins || 0
      })

      return Promise.resolve(totals)
    } catch (error) {
      console.error(`Error en readObjectiveSumByDate: ${error}`)
      return Promise.reject(error)
    }
  }

  /**
   * Función para obtener los registros de cada ingrediente con sus gramos consumidos y las cantidades nutritivas por cada 100 gramos.
   * @private
   * @param date
   */
  private async getIntakeJoinIngredientOnlyValues(date: Date): Promise<NUTRITION_OBJETIVES_TOTALS[]> {
    console.log('Leyendo nutrition_objectives_totals de la fecha', date)
    const query = await this.supabaseService.supabase.from(this.view.nutrition_objectives_totals)
      .select('*')
      .eq('date', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
      .eq('id_user', this.supabaseService.user()?.id)

    if (!!query.error) throw new Error(`${query.error}`)

    console.log('Resultado de leer nutrition_objectives_totals', query.data)

    return query.data
  }
}
