import {SupabaseService} from "@app/api/services/supabase.service";
import {Database} from "@data/types/database"

declare type TABLES = keyof Database['public']['Tables']
declare type VIEWS = keyof Database['public']['Views']
export declare type ENTITES = TABLES | VIEWS

export abstract class supabaseService {
  public abstract tableName: string
  // protected table: Record<TABLES, string> = {
  //   nutrition_objective: 'nutrition_objective',
  //   nutrition_intake: 'nutrition_intake',
  //   nutrition_ingredient: 'nutrition_ingredient'
  // }
  //
  // protected view: Record<VIEWS, string> = {
  //   nutrition_intake_with_totals: 'nutrition_intake_with_totals',
  //   nutrition_objectives_totals: 'nutrition_objectives_totals'
  // }

  constructor(protected supabaseService: SupabaseService) {

  }

}
