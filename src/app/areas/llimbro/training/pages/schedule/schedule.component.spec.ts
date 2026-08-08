import {ComponentFixture, TestBed} from '@angular/core/testing'
import {createTrainingStoreStub} from '@testing/training-store.stub'
import {TrainingStore} from '../../state/training.store'
import {ScheduleComponent} from './schedule.component'

describe('ScheduleComponent', () => {
  let fixture: ComponentFixture<ScheduleComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleComponent],
      providers: [{provide: TrainingStore, useValue: createTrainingStoreStub()}],
    }).compileComponents()
    fixture = TestBed.createComponent(ScheduleComponent)
    fixture.detectChanges()
  })

  it('renders the seven weekdays in order', () => {
    const days = [...fixture.nativeElement.querySelectorAll('.weekday-strip button')]
      .map((button: Element) => button.textContent?.trim())
    expect(days).toEqual(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'])
  })

  it('loads the planned targets for the selected day', () => {
    const monday: HTMLButtonElement = fixture.nativeElement.querySelector('.weekday-strip button')
    monday.click()
    fixture.detectChanges()
    expect(fixture.nativeElement.textContent).toContain('Sentadilla')
    const values = [...fixture.nativeElement.querySelectorAll('.schedule-card input')]
      .map((input: HTMLInputElement) => input.value)
    expect(values).toEqual(['3', '10', '40'])
  })

  it('marks the active schedule used by tracking', () => {
    expect(fixture.nativeElement.textContent).toContain('Horario 1 · activo')
    expect(fixture.nativeElement.textContent).toContain('Activo en Seguimiento')
  })
})
