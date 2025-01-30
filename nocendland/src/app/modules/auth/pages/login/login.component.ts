import { Component } from '@angular/core';
import {SupabaseService} from "@api/services/supabase.service";

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private supabase: SupabaseService) {
  }

  public signIn(): void {
    // this.supabase.signIn('github')
    this.supabase.signInGithub()
  }
}
