import {Database} from '@platform/supabase/database.types'

export type TrainingExercise = Database['public']['Tables']['training_exercise']['Row']
export type TrainingExerciseInsert = Database['public']['Tables']['training_exercise']['Insert']
export type TrainingScheduleItem = Database['public']['Tables']['training_schedule_item']['Row']
export type TrainingScheduleItemInsert = Database['public']['Tables']['training_schedule_item']['Insert']
export type TrainingEntry = Database['public']['Tables']['training_entry']['Row']
export type TrainingEntryInsert = Database['public']['Tables']['training_entry']['Insert']
export type TrainingSet = Database['public']['Tables']['training_set']['Row']
export type TrainingSetInsert = Database['public']['Tables']['training_set']['Insert']

export type TrainingExerciseListItem = TrainingExercise & {imageUrl?: string}
export type TrainingScheduleItemWithExercise = TrainingScheduleItem & {training_exercise: TrainingExercise}
export type TrainingEntryWithDetails = TrainingEntry & {
  training_exercise: TrainingExercise
  training_set: TrainingSet[]
}

export interface TrainingExerciseDraft {
  id?: number
  name: string
  description: string | null
  tips: string[]
  image_path: string | null
}

export interface TrainingScheduleDraft {
  id?: number
  exerciseId: number
  setCount: number
  targetRepetitions: number | null
  targetWeightKg: number | null
  sortOrder: number
}

export interface TrainingSetDraft {
  id?: number
  position: number
  repetitions: number | null
  weightKg: number | null
}

export interface TrainingEntryDraft {
  id?: number
  exerciseId: number
  sortOrder: number
  sets: TrainingSetDraft[]
}

