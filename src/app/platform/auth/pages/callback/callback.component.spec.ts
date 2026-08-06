import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackComponent } from './callback.component';
import {provideRouter} from '@angular/router';
import {AuthService} from '@platform/auth/auth.service';
import {createAuthServiceStub} from '@testing/auth-service.stub';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackComponent],
      providers: [
        provideRouter([]),
        {provide: AuthService, useFactory: createAuthServiceStub}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
