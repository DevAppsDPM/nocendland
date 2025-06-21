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
          grams_per_unit: number | null
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
          grams_per_unit?: number | null
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
          grams_per_unit?: number | null
          id?: number
          id_user?: string
          name?: string
          proteins_per_100?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_ingredient_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_intake: {
        Row: {
          date: string
          id: number
          id_user: string
          ingredient: number
          quantity_in_grams: number | null
        }
        Insert: {
          date?: string
          id?: number
          id_user: string
          ingredient: number
          quantity_in_grams?: number | null
        }
        Update: {
          date?: string
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
            foreignKeyName: "nutrition_intake_ingredient_fkey"
            columns: ["ingredient"]
            isOneToOne: false
            referencedRelation: "nutrition_ingredient"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_objective: {
        Row: {
          calories: number
          carbohydrates: number
          fats: number
          id_user: string
          level: Database["public"]["Enums"]["nutrition_objetive_levels"]
          proteins: number
        }
        Insert: {
          calories?: number
          carbohydrates?: number
          fats?: number
          id_user: string
          level: Database["public"]["Enums"]["nutrition_objetive_levels"]
          proteins?: number
        }
        Update: {
          calories?: number
          carbohydrates?: number
          fats?: number
          id_user?: string
          level?: Database["public"]["Enums"]["nutrition_objetive_levels"]
          proteins?: number
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_objective_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "user"
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
      nutrition_intake_with_totals: {
        Row: {
          calories: number | null
          carbohydrates: number | null
          date: string | null
          fats: number | null
          id_user: string | null
          ingredient: number | null
          ingredient_name: string | null
          intake_id: number | null
          proteins: number | null
          quantity_in_grams: number | null
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
            foreignKeyName: "nutrition_intake_ingredient_fkey"
            columns: ["ingredient"]
            isOneToOne: false
            referencedRelation: "nutrition_ingredient"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_objectives_totals: {
        Row: {
          calories: number | null
          carbohydrates: number | null
          date: string | null
          fats: number | null
          id_user: string | null
          proteins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_intake_id_user_foreign"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      nutrition_objetive_levels: ["keep", "good", "top"],
    },
  },
} as const
