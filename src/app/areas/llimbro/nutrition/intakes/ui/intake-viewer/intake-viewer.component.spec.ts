import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeViewerComponent } from './intake-viewer.component';
import {NutritionStore} from '@areas/llimbro/nutrition/state/nutrition.store';
import {createNutritionStoreStub} from '@testing/nutrition-store.stub';
import {DIALOG_DATA} from '@shared/ui/dialog/dialog.tokens';
import {DialogRef} from '@shared/ui/dialog/dialog-ref';

describe('IntakeViewerComponent', () => {
  let component: IntakeViewerComponent;
  let fixture: ComponentFixture<IntakeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakeViewerComponent],
      providers: [
        {provide: NutritionStore, useFactory: createNutritionStoreStub},
        {provide: DIALOG_DATA, useValue: {currentIndex: 0}},
        {provide: DialogRef, useValue: {close: () => undefined}},
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
