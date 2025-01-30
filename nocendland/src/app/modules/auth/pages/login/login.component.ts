import { Component } from '@angular/core';
import {SUPABASE_SIGNIN_PROVIDER, SupabaseService} from "@api/services/supabase.service";
import {MatButton} from "@angular/material/button"

@Component({
    selector: 'app-login',
  imports: [
    MatButton
  ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(protected supabase: SupabaseService) {
  }
}
