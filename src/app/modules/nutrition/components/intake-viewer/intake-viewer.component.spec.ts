import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeViewerComponent } from './intake-viewer.component';
import {NutritionService} from '@modules/nutrition/services/nutrition.service';
import {createNutritionServiceStub} from '../../../../../testing/nutrition-service.stub';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('IntakeViewerComponent', () => {
  let component: IntakeViewerComponent;
  let fixture: ComponentFixture<IntakeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakeViewerComponent],
      providers: [
        {provide: NutritionService, useFactory: createNutritionServiceStub},
        {provide: MAT_DIALOG_DATA, useValue: {currentIndex: 0}}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
