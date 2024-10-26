﻿import {Database} from "./database";

export type NUTRITION_INGREDIENT = Database['public']['Tables']['nutrition_ingredient']['Row'] & { image: any }
export type NUTRITION_INTAKE = Database['public']['Tables']['nutrition_intake']['Update']
export type NUTRITION_INTAKE_JOIN_NUTRITION_INGREDIENT = {
    date: string
    id: number
    id_user: string
    ingredient: number
    quantity_in_grams: number | null
    nutrition_ingredient: NUTRITION_INGREDIENT
}