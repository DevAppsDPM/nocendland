import {Injectable, signal, WritableSignal} from '@angular/core'
import {
  AuthChangeEvent,
  AuthOtpResponse,
  AuthSession,
  createClient,
  OAuthResponse,
  Session,
  SupabaseClient,
  UserResponse,
} from '@supabase/supabase-js'
import { FileObject, StorageError } from '@supabase/storage-js'
import {environment} from '../../../environments/environment'
import {Router} from "@angular/router";

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public supabase: SupabaseClient
  _session: AuthSession | null = null
  protected storageName: string = 'nocendland'

  public user: WritableSignal<USER | undefined> = signal(undefined)

  private signInModes: Record<SUPABASE_SIGNIN_PROVIDER, (auth: any) => Promise<AuthOtpResponse | OAuthResponse>> = {
    'email': this.signInEmail,
    'github': this.signInOAuth,
    'google': this.signInOAuth,
  }

  protected constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  public addIdUserToEntity(entity: any): any {
    return {
      ...entity,
      id_user: this.user()?.id!
    }
  }

  public addIdUserToEntites(entites: any[]): any[] {
    return entites.map(entity => {
      return {
        ...entity,
        id_user: this.user()?.id!
      }
    })
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  public isAutenticated(): Promise<boolean> {
    return this.supabase.auth.getUser().then((user: UserResponse): boolean => {
        const isAuthenticated: boolean = !!user.data.user
        if (isAuthenticated) this.readUser(user.data.user?.id!)
        return isAuthenticated
      })
  }

  public readUser(userId: string): void {
    console.log('Leyendo información del usuario')
    this.supabase
      .from('user')
      .select(`*`)
      .eq('id', userId)
      .single()
      .then((user) => this.user.set(user.data))
  }

  public authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  public exchangeCodeForSession(code: string): Promise<any> {
    return this.supabase.auth.exchangeCodeForSession(code)
  }

  public signIn(provider: SUPABASE_SIGNIN_PROVIDER, auth?: any): Promise<AuthOtpResponse | OAuthResponse> {
    return this.signInModes[provider](auth)
  }

  private signInEmail(email: string): Promise<AuthOtpResponse> {
    return this.supabase.auth.signInWithOtp({ email })
  }

  public signInOAuth(oauthProvider: SUPABASE_SIGNIN_OAUTH_PROVIDER): Promise<OAuthResponse> { // TODO: CAMBIAR LA URL POR ALGO DE ENVIRONMENTS
    return this.supabase.auth.signInWithOAuth({ provider: oauthProvider, options: { redirectTo: environment.auth_github_redirectTo } })
  }

  public signOut() {
    this.router.navigateByUrl('auth')
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  /* STORAGE */
  public uploadImage(path: string, file: File): Promise<{data: {id: string, path: string, fullPath: string}, error: null} | {data: null, error: StorageError}> {
    const reader = new FileReader()

    const onloadEvent = reader.onload = () => {
      // Convertir a ArrayBuffer
      const arrayBuffer = reader.result as ArrayBuffer

      const byteArray = new Uint8Array(arrayBuffer)

      return this.supabase.storage.from(this.storageName).upload(path, byteArray, { contentType: file.type, upsert: true })
    }

    reader.readAsArrayBuffer(file)

    return onloadEvent()
  }

  public readImage(path: string): Promise<{data: Blob, error: null} | {data: null, error: StorageError}> {
    return this.supabase.storage.from(this.storageName).download(path)
  }

  public readImages(path: string): Promise<{data: FileObject[], error: null} | {data: null, error: StorageError}> {
    return this.supabase.storage.from(this.storageName).list(path)
  }
}

export declare type SUPABASE_SIGNIN_OAUTH_PROVIDER = 'github' | 'google'
export declare type SUPABASE_SIGNIN_PROVIDER = 'email' | SUPABASE_SIGNIN_OAUTH_PROVIDER

interface USER {
  id: string
  user_name: string
  email: string
  avatar_url: string
}
