import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPMlistingComponent } from './dpmlisting.component';

describe('DPMlistingComponent', () => {
  let component: DPMlistingComponent;
  let fixture: ComponentFixture<DPMlistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DPMlistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DPMlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
