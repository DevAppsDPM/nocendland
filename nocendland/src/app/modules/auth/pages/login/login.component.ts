import { Component } from '@angular/core';
import {SUPABASE_SIGNIN_PROVIDER, SupabaseService} from "@api/services/supabase.service";

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private supabase: SupabaseService) {
  }

  public signIn(provider: SUPABASE_SIGNIN_PROVIDER): void {
    this.supabase.signIn(provider)
    // this.supabase.signInGithub()
  }
}
