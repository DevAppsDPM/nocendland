import {Component, input, InputSignal} from '@angular/core';
import {MatCard, MatCardAvatar, MatCardHeader, MatCardTitle, MatCardTitleGroup} from "@angular/material/card"
import {MatProgressBar} from "@angular/material/progress-bar"
import {CoreService} from "@core/services/core.service"

@Component({
  selector: 'dpm-progress-viewer',
  imports: [
    MatCard,
    MatProgressBar,
    MatCardTitle,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardAvatar
  ],
  templateUrl: './dpm-progress-viewer.component.html',
  styleUrl: './dpm-progress-viewer.component.scss'
})
export class DpmProgressViewerComponent {

  public config: InputSignal<DPM_PROGRESS_VIEWER_CONFIG> = input.required<DPM_PROGRESS_VIEWER_CONFIG>()

  constructor(protected core: CoreService) {
  }
}

export declare type DPM_PROGRESS_VIEWER_CONFIG = {
  title: string
  value: number
  objetive: number
}

