import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeViewerComponent } from './intake-viewer.component';

describe('IntakeViewerComponent', () => {
  let component: IntakeViewerComponent;
  let fixture: ComponentFixture<IntakeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakeViewerComponent]
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
