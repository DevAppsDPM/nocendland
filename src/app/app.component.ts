import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DeviceService} from '@platform/browser/device.service'
import {AppUpdateService} from '@platform/browser/app-update.service'

@Component({
    selector: 'app-root',
  imports: [RouterOutlet],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'nocendland'

  private readonly device = inject(DeviceService)
  protected readonly appUpdate = inject(AppUpdateService)
}
