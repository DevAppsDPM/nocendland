import {Injectable} from '@angular/core';
import {API} from "@api/interfaces/api"
import {ENTITES} from "@data/types/supabase"
import {SupabaseService} from "@api/services/supabase.service"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"

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
  /* SAVE */
  /* DELETE */
}
