import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpmProgressViewerComponent } from './dpm-progress-viewer.component';

describe('DpmProgressViewerComponent', () => {
  let component: DpmProgressViewerComponent;
  let fixture: ComponentFixture<DpmProgressViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpmProgressViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpmProgressViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', { title: 'Test', value: 1, objetive: 1 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
