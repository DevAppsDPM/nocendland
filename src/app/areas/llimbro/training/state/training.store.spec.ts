import {TestBed} from '@angular/core/testing'
import {signal} from '@angular/core'
import {ExerciseRepository} from '../data-access/exercise.repository'
import {ScheduleRepository} from '../data-access/schedule.repository'
import {ShareRepository} from '../data-access/share.repository'
import {TrackingRepository} from '../data-access/tracking.repository'
import {TrainingExerciseHistoryEntry} from '../models/training.models'
import {TrainingStore} from './training.store'

describe('TrainingStore previous sessions', () => {
  let store: TrainingStore
  let tracking: jasmine.SpyObj<TrackingRepository>

  beforeEach(() => {
    const exercises = jasmine.createSpyObj<ExerciseRepository>('ExerciseRepository', ['readActive'], {
      saving: signal(false),
      savingImage: signal(false),
    })
    exercises.readActive.and.resolveTo([])
    const schedules = jasmine.createSpyObj<ScheduleRepository>(
      'ScheduleRepository',
      ['ensureDefault', 'readCatalog', 'readAll'],
    )
    schedules.ensureDefault.and.resolveTo()
    schedules.readCatalog.and.resolveTo([])
    schedules.readAll.and.resolveTo([])
    const shares = jasmine.createSpyObj<ShareRepository>('ShareRepository', ['list'])
    shares.list.and.resolveTo([])
    tracking = jasmine.createSpyObj<TrackingRepository>(
      'TrackingRepository',
      ['readByDate', 'readPreviousByExercise'],
    )
    tracking.readByDate.and.resolveTo([])

    TestBed.configureTestingModule({
      providers: [
        TrainingStore,
        {provide: ExerciseRepository, useValue: exercises},
        {provide: ScheduleRepository, useValue: schedules},
        {provide: ShareRepository, useValue: shares},
        {provide: TrackingRepository, useValue: tracking},
      ],
    })
    store = TestBed.inject(TrainingStore)
  })

  it('reuses a request and caches an empty result for the active date', async () => {
    const date = new Date(2026, 7, 5)
    store.selectDate(date)
    tracking.readPreviousByExercise.and.resolveTo(null)

    await Promise.all([store.loadPreviousSessions([3], date), store.loadPreviousSessions([3], date)])
    await store.loadPreviousSessions([3], date)

    expect(tracking.readPreviousByExercise).toHaveBeenCalledOnceWith(3, '2026-8-5')
    expect(store.previousSessions().get(3)).toBeNull()
  })

  it('discards a response when the selected date changes', async () => {
    const firstDate = new Date(2026, 7, 5)
    const secondDate = new Date(2026, 7, 6)
    let resolvePrevious!: (entry: TrainingExerciseHistoryEntry | null) => void
    tracking.readPreviousByExercise.and.returnValue(new Promise(resolve => resolvePrevious = resolve))
    store.selectDate(firstDate)
    const pending = store.loadPreviousSessions([3], firstDate)

    store.selectDate(secondDate)
    resolvePrevious(previousEntry())
    await pending

    expect(store.previousSessions().has(3)).toBeFalse()
  })

  it('keeps reminder failures isolated from tracking state', async () => {
    const date = new Date(2026, 7, 5)
    store.selectDate(date)
    tracking.readPreviousByExercise.and.rejectWith(new Error('network'))

    await expectAsync(store.loadPreviousSessions([3], date)).toBeResolved()
    expect(store.previousSessions().has(3)).toBeFalse()
  })
})

function previousEntry(): TrainingExerciseHistoryEntry {
  return {
    id: 20,
    id_user: 'test-user',
    exercise_id: 3,
    performed_on: '2026-07-29',
    sort_order: 0,
    created_at: '2026-07-29T00:00:00Z',
    updated_at: '2026-07-29T00:00:00Z',
    training_set: [],
  }
}
