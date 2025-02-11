import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveConfigComponent } from './objective-config.component';

describe('ObjectiveConfigComponent', () => {
  let component: ObjectiveConfigComponent;
  let fixture: ComponentFixture<ObjectiveConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectiveConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectiveConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
