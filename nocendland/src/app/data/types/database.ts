export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      nutrition_ingredient: {
        Row: {
          calories_per_100: number | null
          carbohydrates_per_100: number | null
          description: string | null
          fats_per_100: number | null
          id: number
          id_user: string
          name: string
          proteins_per_100: number | null
        }
        Insert: {
          calories_per_100?: number | null
          carbohydrates_per_100?: number | null
          description?: string | null
          fats_per_100?: number | null
          id?: number
          id_user: string
          name: string
          proteins_per_100?: number | null
        }
        Update: {
          calories_per_100?: number | null
          carbohydrates_per_100?: number | null
          description?: string | null
          fats_per_100?: number | null
          id?: number
          id_user?: string
          name?: string
          proteins_per_100?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_ingredient_id_user_foreign"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_intake: {
        Row: {
          date: Date
          id: number
          id_user: string
          ingredient: number
          quantity_in_grams: number | null
        }
        Insert: {
          date?: Date
          id?: number
          id_user: string
          ingredient: number
          quantity_in_grams?: number | null
        }
        Update: {
          date?: Date
          id?: number
          id_user?: string
          ingredient?: number
          quantity_in_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_intake_id_user_foreign"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_intake_ingredient_foreign"
            columns: ["ingredient"]
            isOneToOne: false
            referencedRelation: "nutrition_ingredient"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_objective: {
        Row: {
          carbohydrates: number
          fats: number
          grams: number
          id_nutrition_level: number
          proteins: number
        }
        Insert: {
          carbohydrates?: number
          fats?: number
          grams?: number
          id_nutrition_level: number
          proteins?: number
        }
        Update: {
          carbohydrates?: number
          fats?: number
          grams?: number
          id_nutrition_level?: number
          proteins?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_objective_id_nutrition_level_foreign"
            columns: ["id_nutrition_level"]
            isOneToOne: true
            referencedRelation: "nutrition_objetive_level"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_objetive_level: {
        Row: {
          id: number
          id_user: string
          level: Database["public"]["Enums"]["nutrition_objetive_levels"]
        }
        Insert: {
          id?: number
          id_user: string
          level?: Database["public"]["Enums"]["nutrition_objetive_levels"]
        }
        Update: {
          id?: number
          id_user?: string
          level?: Database["public"]["Enums"]["nutrition_objetive_levels"]
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_objetive_level_id_user_foreign"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          avatar_url: string
          created_at: string
          email: string
          id: string
          user_name: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          email: string
          id?: string
          user_name: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          email?: string
          id?: string
          user_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      nutrition_objetive_levels: "keep" | "good" | "top"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
