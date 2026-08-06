import { Component, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from '@platform/auth/auth.service';

@Component({
    selector: 'app-login',
  imports: [],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(protected auth: AuthService) {
  }
}
