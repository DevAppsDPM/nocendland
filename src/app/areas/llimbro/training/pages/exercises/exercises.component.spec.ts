import {ComponentFixture, TestBed} from '@angular/core/testing'
import {NavigationService} from '@shell/navigation/navigation.service'
import {createTrainingStoreStub} from '@testing/training-store.stub'
import {TrainingStore} from '../../state/training.store'
import {ExercisesComponent} from './exercises.component'

describe('ExercisesComponent', () => {
  let fixture: ComponentFixture<ExercisesComponent>
  const navigation = {to: jasmine.createSpy('to').and.resolveTo(true)}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesComponent],
      providers: [
        {provide: TrainingStore, useValue: createTrainingStoreStub()},
        {provide: NavigationService, useValue: navigation},
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(ExercisesComponent)
    fixture.detectChanges()
  })

  it('renders the exercise catalogue', () => {
    expect(fixture.nativeElement.textContent).toContain('Sentadilla')
  })

  it('opens the creation form from the primary action', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Crear ejercicio"]')
    button.click()
    expect(navigation.to).toHaveBeenCalledWith('training', 'exercise-form', 'new')
  })

  it('opens the detail page from a catalogue item', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.data-list__item')
    button.click()
    expect(navigation.to).toHaveBeenCalledWith('training', 'exercises', '1', {queryParams: {from: 'exercises'}})
  })

  it('offers the full catalogue when entering share mode', () => {
    const button: HTMLButtonElement = fixture.nativeElement
      .querySelector('[aria-label="Seleccionar ejercicios para compartir"]')
    button.click()
    fixture.detectChanges()
    expect(fixture.nativeElement.textContent).toContain('Compartir todos')
  })
})
