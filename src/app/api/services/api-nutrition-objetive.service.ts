import {Injectable} from '@angular/core';
import {API} from "@api/interfaces/api"
import {ENTITES} from "@data/types/supabase"
import {SupabaseService} from "@api/services/supabase.service"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {NUTRITION_OBJECTIVE} from "@data/types/llimbro"

@Injectable({
  providedIn: 'root',
  deps: [LoggerService]
})
export class ApiNutritionObjetiveService implements API {

  entity: ENTITES = 'nutrition_objective'

  constructor(private supabase: SupabaseService, private logger: LoggerService) {
    this.logger.setConfig(ApiNutritionObjetiveService.name, LOGGER_COLORS.API)
  }

  /* READ */
  public async readObjectives(): Promise<NUTRITION_OBJECTIVE[]> {
    this.logger.log('Reading all objectives... ')

    const query = await this.supabase.client.from(this.entity).select('*')//.order('name')

    if (!!query.error) {
      this.logger.error('Error getting objectives... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from all objectives... ', query.data)

    return query.data
  }
  /* SAVE */

  public async saveObjectiveList(objectiveList: NUTRITION_OBJECTIVE[]) {
    this.logger.log('Saving objective list... ', objectiveList)

    objectiveList = this.supabase.addIdUserToEntites(objectiveList)
    const query = await this.supabase.client.from(this.entity).upsert(objectiveList).select()

    if (!!query.error) {
      this.logger.error('Error saving objective list... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from saving objective list... ', query.data)

    return query.data
  }

  /* DELETE */
}
