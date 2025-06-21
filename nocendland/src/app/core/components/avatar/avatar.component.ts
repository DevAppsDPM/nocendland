import {Component, effect, input, InputSignal} from '@angular/core';
import {RESOURCES} from "@data/constants/RESOURCES"
import {MatProgressSpinner} from "@angular/material/progress-spinner"

@Component({
  selector: 'app-avatar',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  public image: InputSignal<string | null> = input<string | null>(null)
  public defaultImage: InputSignal<string> = input<string>(RESOURCES.DEFAULT_IMAGE)
  public loading: InputSignal<boolean> = input<boolean>(false)

  constructor() {
    this.effectDefaultImage()
  }

  private effectDefaultImage(): void {
    effect(() => {
      this.defaultImage()
      // Si defaultImage no está definido, se aplica el valor por defecto
      if (!this.defaultImage()) {
        this.defaultImage.apply(RESOURCES.DEFAULT_IMAGE)
      }
    })
  }

}
