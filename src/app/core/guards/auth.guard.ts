import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SupabaseService} from "@api/services/supabase.service";

export const authGuard: CanActivateChildFn = async (childRoute, state) => {
  const supabase: SupabaseService = inject(SupabaseService)
  const router: Router = inject(Router)

  const authenticated: boolean = await supabase.isAutenticated()
  if (!authenticated) {
    console.log('Autenticado', authenticated)

    router.navigateByUrl('auth').finally(() => console.log('Redirigido a auth.'))
  }

  return authenticated
}
