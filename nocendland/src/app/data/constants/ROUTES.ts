const LLIMBRO_ROUTE = 'llimbro'
const AUTH_ROUTE = 'auth'

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
      OBJECTIVES: 'objectives'
    },
    AUTH: {
      ROUTE: AUTH_ROUTE,
    }
  }
}
