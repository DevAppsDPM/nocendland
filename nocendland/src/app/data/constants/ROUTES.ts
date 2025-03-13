const LLIMBRO_ROUTE = 'llimbro'
const AUTH_ROUTE = 'auth'

const NUTRITION_ROUTE = 'nutrition'

export const ROUTES = {
  MODULES: {
    AUTH: {
      ROUTE: AUTH_ROUTE,
    },
    NUTRITION: {
      ROUTE: NUTRITION_ROUTE,
      CHILDREN: {
        INGREDIENTS: 'ingredients',
        INGREDIENT_VIEW: 'ingredient-view',
        INTAKES: 'intakes',
        OBJECTIVES: 'objectives',
      }
    },

    // TODO ELIMINAR ↓↓↓↓
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
        ROUTE: 'objectives',
        CONFIG: 'objetive-config'
      }
    },
  }
}
