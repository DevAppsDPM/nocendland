import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIngredientsComponent } from './select-ingredients.component';
import {NutritionService} from '../../services/nutrition.service';
import {IntakeService} from '../../services/intake.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';
import {createIntakeServiceStub} from '../../../../../testing/intake-service.stub';

describe('SelectIngredientsComponent', () => {
  let component: SelectIngredientsComponent;
  let fixture: ComponentFixture<SelectIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectIngredientsComponent],
      providers: [
        {provide: NutritionService, useFactory: createNutritionServiceStub},
        {provide: IntakeService, useFactory: createIntakeServiceStub}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
