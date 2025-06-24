import { Injectable } from '@angular/core';
import {SupabaseService} from "@api/services/supabase.service"
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {FileObject, StorageError} from "@supabase/storage-js"
import {RESOURCES} from "@data/constants/RESOURCES"
import {BUCKET_ROUTES} from "@data/constants/BUCKET_ROUTES"

@Injectable({
  providedIn: 'root'
})
export class ApiBucketService {

  constructor(private supabase: SupabaseService, private logger: LoggerService) {
    this.logger.setConfig(ApiBucketService.name, LOGGER_COLORS.API)
  }

  public uploadImage(path: string, file: File): Promise<{data: {id: string, path: string, fullPath: string}, error: null} | {data: null, error: StorageError}> {
    const reader = new FileReader()

    const onloadEvent = reader.onload = () => {
      // Convertir a ArrayBuffer
      const arrayBuffer = reader.result as ArrayBuffer

      const byteArray = new Uint8Array(arrayBuffer)

      return this.supabase.client.storage.from(this.supabase.storageName).upload(path, byteArray, { contentType: file.type, upsert: true })
    }

    reader.readAsArrayBuffer(file)

    return onloadEvent()
  }

  public readImage(path: string): Promise<{data: Blob, error: null} | {data: null, error: StorageError}> {
    return this.supabase.client.storage.from(this.supabase.storageName).download(path)
  }

  public readImages(path: string): Promise<{data: FileObject[], error: null} | {data: null, error: StorageError}> {
    return this.supabase.client.storage.from(this.supabase.storageName).list(path)
  }

  public getRandomDefaultImageRouteForIngredient(): string {
    console.log('Obteniendo imagen aleatoria de ingredientes...')
    const randomRoute: string = `${BUCKET_ROUTES.NUTRITION_INGREDIENT.DEFAULT}/${Math.floor(Math.random() * 7)}.png`
    console.log(randomRoute)
    return randomRoute
  }

  // public downLoadImage(path: string) {
  //   return this.client.storage.from('avatars').download(path)
  // }
  //
  // public uploadAvatar(filePath: string, file: File) {
  //   return this.client.storage.from('avatars').upload(filePath, file)
  // }
}
