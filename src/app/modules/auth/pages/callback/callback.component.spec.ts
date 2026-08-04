import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackComponent } from './callback.component';
import {provideRouter} from '@angular/router';
import {SupabaseService} from '../../../../api/services/supabase.service';
import {createSupabaseServiceStub} from '../../../../../testing/supabase-service.stub';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackComponent],
      providers: [
        provideRouter([]),
        {provide: SupabaseService, useFactory: createSupabaseServiceStub}
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
