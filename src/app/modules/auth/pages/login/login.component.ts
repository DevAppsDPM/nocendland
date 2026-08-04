import { Component, ChangeDetectionStrategy } from '@angular/core';
import {SUPABASE_SIGNIN_PROVIDER, SupabaseService} from "@api/services/supabase.service";
import {MatButton} from "@angular/material/button"

@Component({
    selector: 'app-login',
  imports: [
    MatButton
  ],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(protected supabase: SupabaseService) {
  }
}
