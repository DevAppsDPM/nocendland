import {effect, Injectable, signal} from '@angular/core'
import {formatDateForDatabase} from '@shared/utilities/date.utils'
import {ExerciseRepository} from '../data-access/exercise.repository'
import {ScheduleRepository} from '../data-access/schedule.repository'
import {TrackingRepository} from '../data-access/tracking.repository'
import {
  TrainingEntryDraft,
  TrainingEntryWithDetails,
  TrainingExercise,
  TrainingExerciseDraft,
  TrainingExerciseListItem,
  TrainingScheduleDraft,
  TrainingScheduleItemWithExercise,
} from '../models/training.models'

@Injectable()
export class TrainingStore {
  private readonly exercisesState = signal<TrainingExerciseListItem[]>([])
  private readonly scheduleState = signal<TrainingScheduleItemWithExercise[]>([])
  private readonly entriesState = signal<TrainingEntryWithDetails[]>([])
  private readonly selectedDateState = signal(new Date())
  private readonly loadingExercisesState = signal(false)
  private readonly loadingScheduleState = signal(false)
  private readonly loadingEntriesState = signal(false)
  private readonly savingScheduleState = signal(false)
  private readonly savingEntriesState = signal(false)

  readonly exercises = this.exercisesState.asReadonly()
  readonly schedule = this.scheduleState.asReadonly()
  readonly entries = this.entriesState.asReadonly()
  readonly selectedDate = this.selectedDateState.asReadonly()
  readonly loadingExercises = this.loadingExercisesState.asReadonly()
  readonly loadingSchedule = this.loadingScheduleState.asReadonly()
  readonly loadingEntries = this.loadingEntriesState.asReadonly()
  readonly savingSchedule = this.savingScheduleState.asReadonly()
  readonly savingEntries = this.savingEntriesState.asReadonly()
  readonly savingExercise: ExerciseRepository['saving']
  readonly savingExerciseImage: ExerciseRepository['savingImage']

  constructor(
    private readonly exercisesRepository: ExerciseRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly trackingRepository: TrackingRepository,
  ) {
    this.savingExercise = this.exercisesRepository.saving
    this.savingExerciseImage = this.exercisesRepository.savingImage
    void Promise.all([this.loadExercises(), this.loadSchedule()])
    effect(() => void this.loadEntries(this.selectedDateState()))
  }

  async loadExercises(): Promise<void> {
    this.loadingExercisesState.set(true)
    try {
      const exercises = await this.exercisesRepository.readActive()
      const withImages = await Promise.all(exercises.map(async exercise => {
        if (!exercise.image_path) return exercise
        const image = await this.exercisesRepository.readImage(exercise.id)
        return {...exercise, imageUrl: image ? URL.createObjectURL(image) : undefined}
      }))
      this.exercisesState.set(withImages)
    } finally {
      this.loadingExercisesState.set(false)
    }
  }

  readExercise(id: number): Promise<TrainingExercise> {
    return this.exercisesRepository.readById(id)
  }

  async saveExercise(draft: TrainingExerciseDraft): Promise<TrainingExercise> {
    const saved = await this.exercisesRepository.save(draft)
    await this.loadExercises()
    return saved
  }

  async uploadExerciseImage(exerciseId: number, file: File): Promise<void> {
    await this.exercisesRepository.uploadImage(exerciseId, file)
    await this.loadExercises()
  }

  async archiveExercise(exerciseId: number): Promise<void> {
    await this.exercisesRepository.archive(exerciseId)
    await Promise.all([this.loadExercises(), this.loadSchedule()])
  }

  async loadSchedule(): Promise<void> {
    this.loadingScheduleState.set(true)
    try {
      this.scheduleState.set(await this.scheduleRepository.readAll())
    } finally {
      this.loadingScheduleState.set(false)
    }
  }

  async saveScheduleDay(weekday: number, drafts: readonly TrainingScheduleDraft[]): Promise<void> {
    this.savingScheduleState.set(true)
    try {
      await this.scheduleRepository.replaceDay(weekday, drafts)
      await this.loadSchedule()
    } finally {
      this.savingScheduleState.set(false)
    }
  }

  selectDate(date: Date): void {
    this.selectedDateState.set(date)
  }

  async loadEntries(date = this.selectedDateState()): Promise<void> {
    this.loadingEntriesState.set(true)
    try {
      this.entriesState.set(await this.trackingRepository.readByDate(formatDateForDatabase(date)))
    } finally {
      this.loadingEntriesState.set(false)
    }
  }

  async saveEntries(drafts: readonly TrainingEntryDraft[]): Promise<void> {
    this.savingEntriesState.set(true)
    try {
      await this.trackingRepository.replaceDate(formatDateForDatabase(this.selectedDateState()), drafts)
      await this.loadEntries()
    } finally {
      this.savingEntriesState.set(false)
    }
  }
}
