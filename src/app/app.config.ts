import {ApplicationConfig, isDevMode, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter, Router} from '@angular/router';

import {routes} from './app-routing.module';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {SupabaseService} from "@api/services/supabase.service";
import {provideServiceWorker} from '@angular/service-worker';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideCharts(withDefaultRegisterables())
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps: [SupabaseService, Router],
    //   multi: true
    // }
  ]
}

export async function initializeApp(supabase: SupabaseService, router: Router): Promise<any> {
  const logHeader: string = 'Initialize app => '
  console.log(logHeader, '...')

  const token: string | null = localStorage.getItem('nocendland-token')

  console.log(logHeader, 'token present: ', !!token)

  if (!token) {
    router.navigateByUrl('auth')
    return Promise.resolve()
  }

  const cosa = await supabase.exchangeCodeForSession(token)

  console.log(logHeader, 'cosa present: ', cosa)

  if (!!cosa) return Promise.resolve(cosa)

  return Promise.resolve()
}
