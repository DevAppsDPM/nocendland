import {SupabaseService} from "@app/api/services/supabase.service";

export declare type TABLES = 'nutrition_objective' | 'nutrition_intake' | 'nutrition_ingredient'
export declare type VIEWS = 'nutrition_intake_with_totals' | 'nutrition_objectives_totals'

export abstract class supabaseService {
  public abstract tableName: string
  protected table: Record<TABLES, string> = {
    nutrition_objective: 'nutrition_objective',
    nutrition_intake: 'nutrition_intake',
    nutrition_ingredient: 'nutrition_ingredient'
  }

  protected view: Record<VIEWS, string> = {
    nutrition_intake_with_totals: 'nutrition_intake_with_totals',
    nutrition_objectives_totals: 'nutrition_objectives_totals'
  }

  constructor(protected supabaseService: SupabaseService) {

  }

}
