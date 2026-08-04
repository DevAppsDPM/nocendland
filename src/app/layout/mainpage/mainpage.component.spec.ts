import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainpageComponent } from './mainpage.component';
import {SupabaseService} from '../../api/services/supabase.service';
import {createSupabaseServiceStub} from '../../../testing/supabase-service.stub';
import {provideRouter} from '@angular/router';

describe('MainpageComponent', () => {
  let component: MainpageComponent;
  let fixture: ComponentFixture<MainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainpageComponent],
      providers: [
        provideRouter([]),
        {provide: SupabaseService, useFactory: createSupabaseServiceStub}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
