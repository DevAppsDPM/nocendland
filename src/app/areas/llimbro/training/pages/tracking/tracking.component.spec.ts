import {ComponentFixture, TestBed} from '@angular/core/testing'
import {ActivatedRoute, convertToParamMap} from '@angular/router'
import {NavigationService} from '@shell/navigation/navigation.service'
import {createTrainingStoreStub} from '@testing/training-store.stub'
import {TrainingStore} from '../../state/training.store'
import {TrackingComponent} from './tracking.component'

describe('TrackingComponent', () => {
  let fixture: ComponentFixture<TrackingComponent>
  let store: ReturnType<typeof createTrainingStoreStub>
  const navigation = {to: jasmine.createSpy('to').and.resolveTo(true)}

  beforeEach(async () => {
    store = createTrainingStoreStub()
    await TestBed.configureTestingModule({
      imports: [TrackingComponent],
      providers: [
        {provide: TrainingStore, useValue: store},
        {provide: ActivatedRoute, useValue: {snapshot: {queryParamMap: convertToParamMap({})}}},
        {provide: NavigationService, useValue: navigation},
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(TrackingComponent)
    fixture.detectChanges()
  })

  it('renders persisted repetitions as a preset and labels the weight input', () => {
    const inputs = [...fixture.nativeElement.querySelectorAll('.set-row input')]
      .map((input: HTMLInputElement) => input.value)
    expect(inputs).toEqual(['', '40'])
    expect(fixture.nativeElement.querySelector('.ui-segmented-input__option--active')?.textContent?.trim()).toBe('10')
    expect(fixture.nativeElement.querySelector('.set-row__weight span')?.textContent?.trim()).toBe('Peso · kg')
  })

  it('adds as many set rows as the user needs', () => {
    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('.tracking-entry__add-set')
    addButton.click()
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelectorAll('.set-row').length).toBe(2)
  })

  it('opens the exercise detail preserving the tracking date', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.tracking-entry__detail')
    button.click()
    expect(navigation.to).toHaveBeenCalledWith('training', 'exercises', '1', {
      queryParams: {from: 'tracking', date: '2026-08-03'},
    })
  })

  it('shows the previous session date and its literal sets', () => {
    const reminder: HTMLElement = fixture.nativeElement.querySelector('.tracking-entry__previous')
    expect(reminder.textContent).toContain('Última sesión · 27 de julio de 2026')
    expect(reminder.textContent).toContain('S1')
    expect(reminder.textContent).toContain('10 reps × 40 kg')
    expect(reminder.textContent).toContain('— reps × sin peso')
  })

  it('does not show a reminder when there is no previous session', () => {
    store.previousSessions.set(new Map([[1, null]]))
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('.tracking-entry__previous')).toBeNull()
  })

  it('requests the previous session when adding an exercise during editing', () => {
    const loadPreviousSessions = spyOn(store, 'loadPreviousSessions').and.resolveTo()
    const exercise = {...store.exercises()[0], id: 2, name: 'Press banca'}
    const component = fixture.componentInstance as unknown as {
      addEntries(exercises: readonly typeof exercise[]): void
    }
    component.addEntries([exercise])
    expect(loadPreviousSessions).toHaveBeenCalledOnceWith([2])
  })
})
