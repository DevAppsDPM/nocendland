import {Component, HostListener} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DeviceService} from "@core/services/device.service"

@Component({
    selector: 'app-root',
  imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'nocendland';

  installPromptEvent: any;

  constructor(
    private device: DeviceService // esto es para que se ejecute el constructor
  ) {
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.installPromptEvent = event;
  }

  installPWA() {
    if (this.installPromptEvent) {
      this.installPromptEvent.prompt();
      this.installPromptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA instalada');
        } else {
          console.log('PWA no instalada');
        }
        this.installPromptEvent = null;
      });
    }
  }
}
