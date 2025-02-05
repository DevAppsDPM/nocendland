import {Component, OnInit} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SupabaseService} from "@api/services/supabase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LOCAL_STORAGE_PROPERTIES} from "@data/constants/LOCAL_STORAGE_PROPERTIES"

@Component({
    selector: 'app-callback',
    imports: [
        MatProgressSpinner
    ],
    templateUrl: './callback.component.html',
    styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {

  constructor(private supabase: SupabaseService, private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // Extraer el access_token del fragmento
        const params: URLSearchParams = new URLSearchParams(fragment)
        const accessToken: string | null = params.get('access_token')

        if (!!accessToken) {
          // Aquí puedes guardar el access_token o usarlo como desees
          localStorage.setItem(LOCAL_STORAGE_PROPERTIES.TOKEN, accessToken)

          this.supabase.exchangeCodeForSession(accessToken).then(() => this.router.navigateByUrl(''))
        }
      }
    })
  }
}
