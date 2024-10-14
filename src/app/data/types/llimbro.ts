import {Database} from "./database";

export type NUTRITION_INGREDIENT = Database['public']['Tables']['nutrition_ingredient']['Row'] & { image: any }
