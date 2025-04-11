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
      badges: {
        Row: {
          category: string | null
          created_at: string
          description: string
          difficulty: number | null
          icon: string
          id: number
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          difficulty?: number | null
          icon: string
          id?: number
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          difficulty?: number | null
          icon?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      food_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      food_entries: {
        Row: {
          category_id: number | null
          consumed_at: string
          created_at: string
          food_name: string
          has_photo: boolean | null
          id: string
          meal_type: string | null
          notes: string | null
          quantity: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: number | null
          consumed_at?: string
          created_at?: string
          food_name: string
          has_photo?: boolean | null
          id?: string
          meal_type?: string | null
          notes?: string | null
          quantity?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: number | null
          consumed_at?: string
          created_at?: string
          food_name?: string
          has_photo?: boolean | null
          id?: string
          meal_type?: string | null
          notes?: string | null
          quantity?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_entries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_notes: {
        Row: {
          appointment_date: string | null
          attachments: Json | null
          content: string
          created_at: string
          doctor_name: string | null
          follow_up_date: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date?: string | null
          attachments?: Json | null
          content: string
          created_at?: string
          doctor_name?: string | null
          follow_up_date?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string | null
          attachments?: Json | null
          content?: string
          created_at?: string
          doctor_name?: string | null
          follow_up_date?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_logs: {
        Row: {
          created_at: string
          dosage_taken: string | null
          id: string
          medication_id: string
          notes: string | null
          taken_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage_taken?: string | null
          id?: string
          medication_id: string
          notes?: string | null
          taken_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage_taken?: string | null
          id?: string
          medication_id?: string
          notes?: string | null
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean | null
          created_at: string
          dosage: string | null
          end_date: string | null
          frequency: string | null
          id: string
          name: string
          notes: string | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          name: string
          notes?: string | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          name?: string
          notes?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string
          id: string
          mood_level: number
          notes: string | null
          occurred_at: string
          sleep_quality: number | null
          stress_level: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood_level: number
          notes?: string | null
          occurred_at?: string
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood_level?: number
          notes?: string | null
          occurred_at?: string
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          diagnosis_date: string | null
          diagnosis_type: string | null
          first_name: string | null
          height: number | null
          id: string
          last_name: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          diagnosis_date?: string | null
          diagnosis_type?: string | null
          first_name?: string | null
          height?: number | null
          id: string
          last_name?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          diagnosis_date?: string | null
          diagnosis_type?: string | null
          first_name?: string | null
          height?: number | null
          id?: string
          last_name?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      stool_entries: {
        Row: {
          bristol_type: number
          created_at: string
          has_blood: boolean | null
          has_mucus: boolean | null
          has_photo: boolean | null
          id: string
          notes: string | null
          occurred_at: string
          quantity: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bristol_type: number
          created_at?: string
          has_blood?: boolean | null
          has_mucus?: boolean | null
          has_photo?: boolean | null
          id?: string
          notes?: string | null
          occurred_at?: string
          quantity: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bristol_type?: number
          created_at?: string
          has_blood?: boolean | null
          has_mucus?: boolean | null
          has_photo?: boolean | null
          id?: string
          notes?: string | null
          occurred_at?: string
          quantity?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stool_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      symptom_entries: {
        Row: {
          created_at: string
          id: string
          intensity: number
          notes: string | null
          occurred_at: string
          symptom_type_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intensity: number
          notes?: string | null
          occurred_at?: string
          symptom_type_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intensity?: number
          notes?: string | null
          occurred_at?: string
          symptom_type_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptom_entries_symptom_type_id_fkey"
            columns: ["symptom_type_id"]
            isOneToOne: false
            referencedRelation: "symptom_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symptom_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      symptom_types: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: number
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: number
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: number
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
