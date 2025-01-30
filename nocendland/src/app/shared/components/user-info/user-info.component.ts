import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardHeader, MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {SupabaseService} from "../../../api/services/supabase.service";

@Component({
    selector: 'app-user-info',
    imports: [
        MatButton,
        MatCardModule,
        MatIcon,
        MatProgressSpinner,
        NgIf
    ],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  constructor(public supabase: SupabaseService) {
  }
}
