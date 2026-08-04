import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsComponent } from './ingredients.component';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';

describe('IngredientListComponent', () => {
  let component: IngredientsComponent;
  let fixture: ComponentFixture<IngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsComponent],
      providers: [{provide: NutritionService, useFactory: createNutritionServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
