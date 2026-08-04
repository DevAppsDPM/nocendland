import {Injectable, signal, WritableSignal} from '@angular/core';
import { SupabaseService } from '@api/services/supabase.service';
import { NUTRITION_INTAKE, NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT } from '@data/types/llimbro';
import { supabaseService } from '@data/types/supabase';


@Injectable({
  providedIn: 'root'
})
export class IntakeService extends supabaseService {
  tableName: string = 'nutrition_intake'

  public multiselectList: WritableSignal<boolean> = signal(false)

  constructor(protected override supabaseService: SupabaseService) {
    super(supabaseService)
  }

  public async readIntakesByDate(date: Date): Promise<NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]> {
    const query = await this.supabaseService.client.from(this.tableName).select('*, nutrition_ingredient(*)').eq('date', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())

    if (!query.data) return Promise.reject(query.error)

    console.log('NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT[]', query.data)

    return query.data
  }

  public async saveIntake(intake: NUTRITION_INTAKE) {
    intake = this.supabaseService.addIdUserToEntity(intake)
    const query = await this.supabaseService.client.from(this.tableName).upsert(intake).select().single()

    return query.data
  }

  public async saveIntakes(intakes: NUTRITION_INTAKE[]) {
    intakes = this.supabaseService.addIdUserToEntites(intakes)
    const query = await this.supabaseService.client.from(this.tableName).upsert(intakes).select()

    return query.data
  }

  public async deleteIntakes(intakeIds: number[]) {
    const query = await this.supabaseService.client.from(this.tableName).delete().in('id', intakeIds)

    return query.data
  }
}
