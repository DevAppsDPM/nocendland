import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectivesComponent } from './objectives.component';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';

describe('ObjectivesComponent', () => {
  let component: ObjectivesComponent;
  let fixture: ComponentFixture<ObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectivesComponent],
      providers: [{provide: NutritionService, useFactory: createNutritionServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
