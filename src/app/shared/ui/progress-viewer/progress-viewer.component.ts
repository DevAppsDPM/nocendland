import {Component, input, InputSignal, ChangeDetectionStrategy} from '@angular/core';
import {MatCard, MatCardAvatar, MatCardHeader, MatCardTitle, MatCardTitleGroup} from "@angular/material/card"
import {MatProgressBar} from "@angular/material/progress-bar"
import {MathService} from "@shared/utilities/math.service"

@Component({
  selector: 'app-progress-viewer',
  imports: [
    MatCard,
    MatProgressBar,
    MatCardTitle,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardAvatar
  ],
  templateUrl: './progress-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './progress-viewer.component.scss'
})
export class ProgressViewerComponent {

  public config: InputSignal<ProgressViewerConfig> = input.required<ProgressViewerConfig>()

  constructor(protected math: MathService) {
  }
}

export declare type ProgressViewerConfig = {
  title: string
  value: number
  objective: number
}
