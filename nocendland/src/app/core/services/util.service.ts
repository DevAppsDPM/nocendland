import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  // Debounce
  private interval: any = undefined
  private timer: number = 0

  constructor() { }

  /* DEBOUNCE */
  public debounce(func: () => void, wait: number) {
    this.timer = wait

    if (!!this.interval) clearInterval(this.interval)

    this.interval = setInterval(() => {
      if (this.timer === 0) {
        func()
        clearInterval(this.interval)
      }
      this.timer -= 100
    }, 100)
  }

  /* OBJECTS */

  /**
   * Aplana el mapa que se le pasa, dejando todas las propiedades en el nivel 0
   * @param object
   */
  public flattenObject(object: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {}

    for (const key in object) {
      const value = object[key]
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, this.flattenObject(value))
      } else {
        result[key] = value
      }
    }

    return result
  }

  /* REPLACEMENT */
  public replaceVariables(config: CORE_UTILS_REPLACE_CONFIG): string | Record<string, any> {
    const marker = config.marker || '%'
    const variables = this.flattenObject(config.variableObject)

    if (typeof config.replacement === 'string') {
      let result = config.replacement
      for (const key in variables) {
        const value = variables[key]
        const regex = new RegExp(`${marker}${key}${marker}`, 'g')
        result = result.replace(regex, value)
      }
      return result
    } else {
      const result = { ...config.replacement } // copia para no mutar el original
      for (const replacementKey in result) {
        if (typeof result[replacementKey] === 'object') result[replacementKey] = this.replaceVariables({replacement: result[replacementKey], variableObject: variables})

        for (const variableKey in variables) {
          const value = variables[variableKey]

          if (result[replacementKey] === `${marker}${variableKey}${marker}`) {
            result[replacementKey] = value
          }
        }
      }
      return result
    }
  }

}

export declare type CORE_UTILS_REPLACE_CONFIG = {
  /**
   * Record dónde se buscará las propiedades marcadas en {@link replacement}
   */
  variableObject: Record<string, any>
  /**
   * Si es un string deberá tener marcas para la sustitución, por ejemplo: %casa%. casa será la clave que se buscará en
   * {@link variableObject}.
   * Si es un Record, deberá tener claves cuyo valor sean referencias a buscar en {@link variableObject}.
   * Este es string u objeto que se devolverá tras el proceso.
   */
  replacement: string | Record<string, any>
  /**
   * Delimitador que se utilizará para buscar en {@link variableObject}.
   * Por defecto: %
   */
  marker?: string
}
