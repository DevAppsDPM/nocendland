const LLIMBRO_ROUTE = 'llimbro'
const AUTH_ROUTE = 'auth'
const OBJETIVE_ROUTE = 'objectives'

export const ROUTES = {
  MODULES: {
    LLIMBRO: {
      ROUTE: LLIMBRO_ROUTE,
      EXERCISES: 'exercises',
      NUTRITION: 'nutrition',
      INGREDIENT: {
        ROUTE: 'ingredient',
        INGREDIENT_LIST: 'list',
        INGREDIENT_FORM: 'form',
      },
      INTAKE: {
        ROUTE: 'intake',
        VIEW: 'view',
        SELECT_INGREDIENTS: 'select-ingredients'
      },
      OBJECTIVES: {
        ROUTE: OBJETIVE_ROUTE,
        CONFIG: 'objetive-config'
      }
    },
    AUTH: {
      ROUTE: AUTH_ROUTE,
    }
  }
}
