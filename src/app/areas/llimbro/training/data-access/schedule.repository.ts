import {Injectable} from '@angular/core'
import {AuthService} from '@platform/auth/auth.service'
import {SupabaseClientService} from '@platform/supabase/supabase-client.service'
import {TrainingScheduleDraft, TrainingScheduleItemInsert, TrainingScheduleItemWithExercise} from '../models/training.models'

@Injectable()
export class ScheduleRepository {
  constructor(private readonly supabase: SupabaseClientService, private readonly auth: AuthService) {}

  async readAll(): Promise<TrainingScheduleItemWithExercise[]> {
    const query = await this.supabase.client.from('training_schedule_item')
      .select('*, training_exercise(*)')
      .eq('id_user', this.auth.requireUserId())
      .order('weekday').order('sort_order')
    if (query.error) return Promise.reject(query.error)
    return query.data
  }

  async replaceDay(weekday: number, drafts: readonly TrainingScheduleDraft[]): Promise<void> {
    const userId = this.auth.requireUserId()
    const current = await this.supabase.client.from('training_schedule_item').select('id')
      .eq('id_user', userId).eq('weekday', weekday)
    if (current.error) return Promise.reject(current.error)

    const retainedIds = new Set(drafts.flatMap(draft => draft.id ? [draft.id] : []))
    const removedIds = current.data.map(item => item.id).filter(id => !retainedIds.has(id))
    if (removedIds.length) {
      const deletion = await this.supabase.client.from('training_schedule_item').delete()
        .eq('id_user', userId).in('id', removedIds)
      if (deletion.error) return Promise.reject(deletion.error)
    }

    if (!drafts.length) return
    const values: TrainingScheduleItemInsert[] = drafts.map(draft => ({
      id_user: userId,
      exercise_id: draft.exerciseId,
      weekday,
      set_count: draft.setCount,
      target_repetitions: draft.targetRepetitions,
      target_weight_kg: draft.targetWeightKg,
      sort_order: draft.sortOrder,
      updated_at: new Date().toISOString(),
    }))
    const query = await this.supabase.client.from('training_schedule_item').upsert(values, {
      onConflict: 'id_user,weekday,exercise_id',
    })
    if (query.error) return Promise.reject(query.error)
  }
}
