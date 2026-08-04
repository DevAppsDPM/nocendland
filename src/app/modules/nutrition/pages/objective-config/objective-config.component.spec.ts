import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveConfigComponent } from './objective-config.component';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';

describe('ObjectiveConfigComponent', () => {
  let component: ObjectiveConfigComponent;
  let fixture: ComponentFixture<ObjectiveConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectiveConfigComponent],
      providers: [{provide: NutritionService, useFactory: createNutritionServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectiveConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
