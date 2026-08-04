import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

import {SupabaseService} from "@api/services/supabase.service";

@Component({
    selector: 'app-user-info',
    imports: [
    MatButton,
    MatCardModule,
    MatIcon,
    MatProgressSpinner
],
    templateUrl: './user-info.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  constructor(public supabase: SupabaseService) {
  }
}
