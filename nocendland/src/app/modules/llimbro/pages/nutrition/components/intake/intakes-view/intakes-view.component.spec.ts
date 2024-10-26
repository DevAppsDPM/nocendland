import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakesViewComponent } from './intakes-view.component';

describe('IntakesViewComponent', () => {
  let component: IntakesViewComponent;
  let fixture: ComponentFixture<IntakesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
