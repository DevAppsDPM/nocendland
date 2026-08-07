import {ComponentFixture, TestBed} from '@angular/core/testing'
import {createTrainingStoreStub} from '@testing/training-store.stub'
import {TrainingStore} from '../../state/training.store'
import {TrackingComponent} from './tracking.component'

describe('TrackingComponent', () => {
  let fixture: ComponentFixture<TrackingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingComponent],
      providers: [{provide: TrainingStore, useValue: createTrainingStoreStub()}],
    }).compileComponents()
    fixture = TestBed.createComponent(TrackingComponent)
    fixture.detectChanges()
  })

  it('renders persisted sets with repetitions and weight', () => {
    const inputs = [...fixture.nativeElement.querySelectorAll('.set-row input')]
      .map((input: HTMLInputElement) => input.value)
    expect(inputs).toEqual(['10', '40'])
  })

  it('adds as many set rows as the user needs', () => {
    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('.tracking-entry__add-set')
    addButton.click()
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelectorAll('.set-row').length).toBe(2)
  })
})

