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
  public async readObjectiveSumByDate(date: Date): Promise<void> {
    try {
      const values = await this.getIntakeJoinIngredientOnlyValues(date)
      // values.map((value: NUTRITION_INTAKE_WITH_TOTALS) => {
      //   value.
      // })
    } catch (error) {
      console.error(`Error en readObjectiveSumByDate: ${error}`)
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

    if (!!query.error) throw new Error(`${query.error}`)

    console.log('Resultado de leer nutrition_objectives_totals', query.data)

    return query.data
  }
}
