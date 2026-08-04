import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientFormComponent } from './ingredient-form.component';
import {ActivatedRoute} from '@angular/router';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';

describe('IngredientFormComponent', () => {
  let component: IngredientFormComponent;
  let fixture: ComponentFixture<IngredientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientFormComponent],
      providers: [
        provideCharts(withDefaultRegisterables()),
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 'new'}}}},
        {provide: NutritionService, useFactory: createNutritionServiceStub}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
