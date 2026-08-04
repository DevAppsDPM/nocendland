import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsListComponent } from './ingredients-list.component';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';

describe('IngredientsComponent', () => {
  let component: IngredientsListComponent;
  let fixture: ComponentFixture<IngredientsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsListComponent],
      providers: [{provide: NutritionService, useFactory: createNutritionServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
