import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeListComponent } from './intake-list.component';
import {IntakeService} from '../../services/intake.service';
import {createIntakeServiceStub} from '../../../../../testing/intake-service.stub';

describe('IntakeListComponent', () => {
  let component: IntakeListComponent;
  let fixture: ComponentFixture<IntakeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakeListComponent],
      providers: [{provide: IntakeService, useFactory: createIntakeServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
