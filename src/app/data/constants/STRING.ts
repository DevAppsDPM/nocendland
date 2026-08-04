export const STRING = {
  COMMON: {
    ACTIONS: {
      ADD: 'Añadir',
      EDIT: 'Editar',
      DELETE: 'Eliminar',
      SAVE: 'Guardar',
      CANCEL: 'Cancelar',
      CLOSE: 'Cerrar',
      SEARCH: 'Buscar',
      SELECT: 'Seleccionar',
      CLEAR: 'Limpiar',
      SUBMIT: 'Enviar'
    },
    LOADING: 'Cargando... ',
  },
  MODULES: {
    LLIMBRO: {
      NAME: '',
      CHILDREN: {
        NUTRITION: {
          NAME: '',
          COMPONENTS: {
            INGREDIENT: {
              NAME: 'Alimentos',
              FORM_TITLE_NEW: 'Nuevo alimento',
              FORM_TITLE_EDIT: 'Editar alimento',
              FORM_TITLE_VIEW: 'Alimento',
              FORM_ADD_PHOTO: 'Subir foto',
              LIST_TITLE: 'Lista de alimentos',
              SELECT_INGREDIENTS: 'Selecciona los alimentos de hoy',
              LIST_AVATAR_ALT: 'Avatar del alimento en la lista de alimentos',
              FORM_LABELS: {
                NAME: 'Nombre',
                CALORIES: 'Calorías',
                PROTEINS: 'Proteínas',
                FATS: 'Grasas',
                CARBOHYDRATES: 'Hidratos',
                PICTURE: 'Foto',
                DESCRIPTION: 'Descripción',
                GRAMS_PER_UNIT: 'Gramos por unidad',
              }
            },
            INTAKE: {
              NAME: 'Ingesta',
              VIEWER: {
                EXPLANATION_UNITS: 'Este valor calculará los gramos en base a los gramos por unidad del alimento seleccionado. No es necesario introducirlo.',
              }
            },
            OBJECTIVES: {
              NAME: 'Objetivos'
            }
          }
        }
      }
    }
  },
  SHARED: {
    DIALOGS: {
      ACCEPT_BUTTON: 'Aceptar',
      CANCEL_BUTTON: 'Cancelar',
    },
    SERVICES: {
    }
  }
}
