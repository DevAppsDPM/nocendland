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
import {LOCAL_STORAGE_PROPERTIES} from "@data/constants/LOCAL_STORAGE_PROPERTIES"
import {LoggerService} from "@core/services/logger.service"


@Injectable({
  providedIn: 'root',
  deps: [LoggerService]
})
export class SupabaseService {
  public client: SupabaseClient
  _session: AuthSession | null = null
  protected storageName: string = 'nocendland'

  public user: WritableSignal<USER | undefined> = signal(undefined)

  // private signInModes: Record<SUPABASE_SIGNIN_PROVIDER, (auth?: any) => Promise<AuthOtpResponse | OAuthResponse>> = {
  //   'email': this.signInEmail,
  //   'github': this.signInOAuth,
  //   'google': this.signInOAuth,
  // }

  protected constructor(private router: Router, private logger: LoggerService) {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey)
    this.logger.setConfig(SupabaseService.name, '#3ecf8e')
    this.onAuthStateChangeSubscription()
  }

  /* UTILS */

  public handleQueryError<T>(query: { error: any; data: T }, log: string): Promise<T> {
    if (!!query.error) {
      this.logger.error(`Supabase query error: [${log}]`, query.error)
      return Promise.reject(query.error)
    }
    return Promise.resolve(query.data)
  }

  /* AUTH */

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
    this.client.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  public isAuthenticated(): Promise<boolean> {
    return this.client.auth.getUser().then((user: UserResponse): boolean => {
        const isAuthenticated: boolean = !!user.data.user
        if (isAuthenticated) this.readUser(user.data.user?.id!)
        return isAuthenticated
      })
  }

  public readUser(userId: string): void {
    this.logger.log('Leyendo información del usuario')
    this.client
      .from('user')
      .select(`*`)
      .eq('id', userId)
      .single()
      .then((user) => this.user.set(user.data))
  }

  public authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback)
  }

  public exchangeCodeForSession(code: string): Promise<any> {
    return this.client.auth.exchangeCodeForSession(code)
  }

  // public signIn(provider: SUPABASE_SIGNIN_PROVIDER, auth?: any): Promise<AuthOtpResponse | OAuthResponse> {
  //   // return this.signInModes[provider](auth || undefined)
  // }

  private signInEmail(email: string): Promise<AuthOtpResponse> {
    return this.client.auth.signInWithOtp({ email })
  }

  public signInGithub(): Promise<OAuthResponse> {
    return this.client.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: environment.auth_github_redirectTo } })
  }

  public signInGoogle(): Promise<OAuthResponse> {
    return this.client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: environment.auth_github_redirectTo } })
  }

  public signOut() {
    this.router.navigateByUrl('auth')
    localStorage.removeItem(LOCAL_STORAGE_PROPERTIES.TOKEN)
    return this.client.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.client.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.client.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.client.storage.from('avatars').upload(filePath, file)
  }

  /* STORAGE */
  public uploadImage(path: string, file: File): Promise<{data: {id: string, path: string, fullPath: string}, error: null} | {data: null, error: StorageError}> {
    const reader = new FileReader()

    const onloadEvent = reader.onload = () => {
      // Convertir a ArrayBuffer
      const arrayBuffer = reader.result as ArrayBuffer

      const byteArray = new Uint8Array(arrayBuffer)

      return this.client.storage.from(this.storageName).upload(path, byteArray, { contentType: file.type, upsert: true })
    }

    reader.readAsArrayBuffer(file)

    return onloadEvent()
  }

  public readImage(path: string): Promise<{data: Blob, error: null} | {data: null, error: StorageError}> {
    return this.client.storage.from(this.storageName).download(path)
  }

  public readImages(path: string): Promise<{data: FileObject[], error: null} | {data: null, error: StorageError}> {
    return this.client.storage.from(this.storageName).list(path)
  }

  private onAuthStateChangeSubscription(): void {
    this.client.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change', event, session)
      // if (event === 'SIGNED_OUT' || !session) {
      //   // Aquí puedes redirigir al login o mostrar un mensaje
      //   this.router.navigateByUrl('/auth')
      // }
    })
  }
}


export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

export declare type SUPABASE_SIGNIN_OAUTH_PROVIDER = 'github' | 'google'
export declare type SUPABASE_SIGNIN_PROVIDER = 'email' | SUPABASE_SIGNIN_OAUTH_PROVIDER

interface USER {
  id: string
  user_name: string
  email: string
  avatar_url: string
}
