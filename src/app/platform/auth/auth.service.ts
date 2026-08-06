import {Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {OAuthResponse} from '@supabase/supabase-js';
import {SupabaseClientService} from '@platform/supabase/supabase-client.service';
import {Database} from '@platform/supabase/database.types';

export type AuthProvider = 'github' | 'google'
export type AppUser = Database['public']['Tables']['user']['Row']

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly userState = signal<AppUser | undefined>(undefined)

  readonly user = this.userState.asReadonly()

  constructor(
    private readonly supabase: SupabaseClientService,
    private readonly router: Router,
  ) {}

  public async isAuthenticated(): Promise<boolean> {
    const {data, error} = await this.supabase.client.auth.getUser()
    if (error || !data.user) {
      this.userState.set(undefined)
      return false
    }

    await this.loadUserProfile(data.user.id)
    return true
  }

  public exchangeCodeForSession(code: string) {
    return this.supabase.client.auth.exchangeCodeForSession(code)
  }

  public signInWithGithub(): Promise<OAuthResponse> {
    return this.signInWithOAuth('github')
  }

  public signInWithGoogle(): Promise<OAuthResponse> {
    return this.signInWithOAuth('google')
  }

  public async signOut(): Promise<void> {
    const {error} = await this.supabase.client.auth.signOut()
    if (error) throw error

    this.userState.set(undefined)
    await this.router.navigateByUrl('/auth')
  }

  public requireUserId(): string {
    const userId = this.userState()?.id
    if (!userId) throw new Error('No authenticated user is available')
    return userId
  }

  private signInWithOAuth(provider: AuthProvider): Promise<OAuthResponse> {
    return this.supabase.client.auth.signInWithOAuth({
      provider,
      options: {redirectTo: this.authRedirectUrl},
    })
  }

  private async loadUserProfile(userId: string): Promise<void> {
    const {data, error} = await this.supabase.client
      .from('user')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    this.userState.set(data)
  }

  private get authRedirectUrl(): string {
    return new URL('/auth/callback', globalThis.location.origin).toString()
  }
}
