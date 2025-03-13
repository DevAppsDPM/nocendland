import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {LOGGER_COLORS, LoggerService} from "@core/services/logger.service"
import {filter, Observable} from "rxjs"

// export declare type NAVIGATION_MODULES = 'auth' | 'nutrition'
// export declare type NAVIGATION_AUTH_CHILDREN = 'auth-page'
// export declare type NAVIGATION_NUTRITION_CHILDREN = 'ingredients' | 'ingredient-view' | 'intakes' | 'objectives'
//
// export declare type NAVIGATION_MODULE = {
//   module: NAVIGATION_MODULES
//   children?: Partial<Record<
//     NAVIGATION_AUTH_CHILDREN | NAVIGATION_NUTRITION_CHILDREN,
//     NAVIGATION_AUTH_CHILDREN | NAVIGATION_NUTRITION_CHILDREN
//   >>
//   // Para añadir más children hay que poner aquí tuberías por todos lados. Por ejemplo: Partial<Record<NAVIGATION_NUTRITION_CHILDREN | NAVIGATION_EXERCISES_CHILDREN, NAVIGATION_NUTRITION_CHILDREN | NAVIGATION_EXERCISES_CHILDREN>>
// }
//
// export const NAVIGATION_NUTRITION_CHILDREN_INGREDIENTS: NAVIGATION_NUTRITION_CHILDREN = 'ingredients'
// export const NAVIGATION_NUTRITION_CHILDREN_INTAKES: NAVIGATION_NUTRITION_CHILDREN = 'intakes'
// export const NAVIGATION_NUTRITION_CHILDREN_OBJETIVES: NAVIGATION_NUTRITION_CHILDREN = 'objectives'
// export const NAVIGATION_NUTRITION_CHILDREN_INGREDIENT_VIEW: NAVIGATION_NUTRITION_CHILDREN = 'ingredient-view'
//
// export const NAVIGATION_MODULE_NUTRITION: NAVIGATION_MODULE = {
//   module: 'nutrition',
//   children: {
//     ingredients: NAVIGATION_NUTRITION_CHILDREN_INGREDIENTS,
//     intakes: NAVIGATION_NUTRITION_CHILDREN_INTAKES,
//     objectives: NAVIGATION_NUTRITION_CHILDREN_OBJETIVES,
//     "ingredient-view": NAVIGATION_NUTRITION_CHILDREN_INGREDIENT_VIEW,
//   },
// }
//
// export const NAVIGATION_MODULE_AUTH: NAVIGATION_MODULE = {
//   module: 'auth',
// }
//
// export const NAVIGATION_ROUTES: Record<NAVIGATION_MODULES, NAVIGATION_MODULE> = {
//   auth: NAVIGATION_MODULE_AUTH,
//   nutrition: NAVIGATION_MODULE_NUTRITION
// }







export const NAVIGATION_ROUTES = {
  auth: { module: 'auth', children: { 'auth-page': 'auth-page' } },
  nutrition: {
    module: 'nutrition',
    children: {
      'intakes': 'intakes',
      'ingredients': 'ingredients',
      'ingredient-form': 'ingredient-form',
      'objectives': 'objectives',
      'ingredient-view': 'ingredient-view',
    }
  },
} as const

type RoutesKeys = keyof typeof NAVIGATION_ROUTES;
type ChildRoutes<T extends RoutesKeys> = keyof typeof NAVIGATION_ROUTES[T]['children'];


@Injectable({
  providedIn: 'root',
  deps: [LoggerService]
})
export class NavigateService {

  private _replaceKey: string = '$1'
  private _localStorageKey: string = `NAVIGATE_MODULE_${this._replaceKey}_LAST_CHILDREN`

  constructor(private logger: LoggerService, private router: Router) {
    this.logger.setConfig(NavigateService.name, LOGGER_COLORS.NAVIGATE)
  }

  /* NAVIGATION */

  /**
   * - Si se le pasa _module_, _child_ y (opcional) _param_, navegará y almacenará el path en localStorage para ese módulo.
   * - Si se le pasa solo _module_, intentará navegar al path almacenado en localStorage, si no hay ninguno navegará a la primera key disponible.
   * @param module
   * @param child
   * @param param
   */
  to<T extends RoutesKeys, C extends ChildRoutes<T>>(module: T, child?: C, param?: string): Promise<boolean> {
    let lastModulePath: string[] | undefined
    if (!child) lastModulePath = this.getLastModulePath(module)

    const _module: string = NAVIGATION_ROUTES[module].module
    // @ts-ignore
    const _children: string = !!child ? NAVIGATION_ROUTES[module].children[child] : Object.keys(NAVIGATION_ROUTES[module].children).at(0)

    let path: string[] = !!lastModulePath ? lastModulePath : [_module, _children]
    if (!!param) path.push(param)

    this.storeLastModulePath(_module, path)

    return this.router.navigate(path)
  }

  private storeLastModulePath(module: string, lastPath: string[]): void {
    // Guarda un objeto en localStorage con una clave que hace referencia al módulo. El valor es el "children".
    localStorage.setItem(this.getLocalStorageKey(module), JSON.stringify(lastPath));
  }

  private getLastModulePath(module: string): string[] | undefined {
    const pathItem: string | null = localStorage.getItem(this.getLocalStorageKey(module))
    if (!pathItem) return undefined
    return JSON.parse(pathItem) || []
  }

  private getLocalStorageKey(module: string): string {
    return this._localStorageKey.replace(this._replaceKey, module)
  }

  /* ROUTE LISTENERS */

  public listenerNavigationEnd(): Observable<NavigationEnd> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
  }
}
