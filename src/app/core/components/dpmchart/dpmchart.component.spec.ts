import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpmchartComponent } from './dpmchart.component';

describe('DpmchartComponent', () => {
  let component: DpmchartComponent;
  let fixture: ComponentFixture<DpmchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpmchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpmchartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', {
      data: { values: [1] },
      labels: ['Test'],
      orientation: 'vertical'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
