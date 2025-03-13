import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIngredientsComponent } from './select-ingredients.component';

describe('SelectIngredientsComponent', () => {
  let component: SelectIngredientsComponent;
  let fixture: ComponentFixture<SelectIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectIngredientsComponent]
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
