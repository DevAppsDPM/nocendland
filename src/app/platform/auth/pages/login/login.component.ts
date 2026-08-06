import { Component, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from '@platform/auth/auth.service';
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
  constructor(protected auth: AuthService) {
  }
}
