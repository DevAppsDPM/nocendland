import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeComponent } from './intake.component';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';

describe('IntakeComponent', () => {
  let component: IntakeComponent;
  let fixture: ComponentFixture<IntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakeComponent],
      providers: [{provide: NutritionService, useFactory: createNutritionServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
