import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, Router} from '@angular/router';

import {routes} from './app-routing.module';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {SupabaseService} from "@api/services/supabase.service";
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(), provideAnimationsAsync(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
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
