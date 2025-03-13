import { Injectable } from '@angular/core';
import {API} from "@api/interfaces/api"
import {ENTITES} from "@data/types/supabase"
import {SupabaseService} from "@api/services/supabase.service"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {ApiNutritionObjetiveService} from "@api/services/api-nutrition-objetive.service"
import {NUTRITION_INTAKE, NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT} from "@data/types/llimbro"

@Injectable({
  providedIn: 'root',
  deps: [LoggerService]
})
export class ApiNutritionIntakeService implements API {

  entity: ENTITES = 'nutrition_intake'

  constructor(private supabase: SupabaseService, private logger: LoggerService) {
    this.logger.setConfig(ApiNutritionObjetiveService.name, LOGGER_COLORS.API)
  }

  /* READ */

  public async readIntakesJoinIngredientByDate(date: Date): Promise<NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]> {
    this.logger.log('Reading intakes join ingredient by date: ', date)

    const query = await this.supabase.client
      .from(this.entity)
      .select('*, nutrition_ingredient(*)')
      .eq('date', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())

    if (!!query.error) {
      this.logger.error('Error in reading intakes join ingredient by date: ', date, query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from intakes join ingredient by date: ', query.data)

    return query.data.sort((a, b) => {
      // Ordena por nombre
      const nameComparison = a.nutrition_ingredient.name.localeCompare(b.nutrition_ingredient.name);
      if (nameComparison !== 0) return nameComparison;
      // Si los nombres son iguales, ordena por ID
      return a.id - b.id;
    })
  }

  /* SAVE */

  public async saveIntake(intake: NUTRITION_INTAKE): Promise<NUTRITION_INTAKE> {
    this.logger.log('Saving intake... ', intake)

    intake = this.supabase.addIdUserToEntity(intake)
    const query = await this.supabase.client.from(this.entity).upsert(intake).select().single()

    if (!!query.error) {
      this.logger.error('Error saving intake... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from saving intake: ', query.data)

    return query.data
  }

  public async saveIntakeList(intakeList: NUTRITION_INTAKE[]) {
    this.logger.log('Saving intake list... ', intakeList)

    intakeList = this.supabase.addIdUserToEntites(intakeList)
    const query = await this.supabase.client.from(this.entity).upsert(intakeList).select()

    if (!!query.error) {
      this.logger.error('Error saving intake list... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result from saving intake list... ', query.data)

    return query.data
  }

  /* DELETE */

  public async deleteIntakesByIdList(intakeIdList: number[]) {
    this.logger.log('Deleting intakes by id list... ', intakeIdList)

    const query = await this.supabase.client.from(this.entity).delete().in('id', intakeIdList)

    if (!!query.error) {
      this.logger.error('Error deleting intake list... ', query.error)
      return Promise.reject(query.error)
    }

    this.logger.log('Result deleting intakes by id list... ', query.data)

    return query.data
  }
}
