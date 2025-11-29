export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      breakdown_requests: {
        Row: {
          actual_cost: number | null
          created_at: string | null
          driver_id: string
          estimated_cost: number | null
          id: string
          issue: string
          latitude: number | null
          location: string
          longitude: number | null
          mechanic_id: string | null
          status: string
          truck_id: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          created_at?: string | null
          driver_id: string
          estimated_cost?: number | null
          id?: string
          issue: string
          latitude?: number | null
          location: string
          longitude?: number | null
          mechanic_id?: string | null
          status?: string
          truck_id: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          created_at?: string | null
          driver_id?: string
          estimated_cost?: number | null
          id?: string
          issue?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          mechanic_id?: string | null
          status?: string
          truck_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fleet_metrics: {
        Row: {
          created_at: string | null
          diesel_consumed: number | null
          id: string
          mileage: number | null
          owner_id: string
          trip_date: string
          truck_id: string
        }
        Insert: {
          created_at?: string | null
          diesel_consumed?: number | null
          id?: string
          mileage?: number | null
          owner_id: string
          trip_date: string
          truck_id: string
        }
        Update: {
          created_at?: string | null
          diesel_consumed?: number | null
          id?: string
          mileage?: number | null
          owner_id?: string
          trip_date?: string
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_metrics_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_history: {
        Row: {
          cost: number
          created_at: string | null
          driver_id: string
          duration_minutes: number | null
          id: string
          issue: string
          mechanic_id: string | null
          parts_used: string | null
          rating: number | null
          service_date: string | null
          truck_id: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          driver_id: string
          duration_minutes?: number | null
          id?: string
          issue: string
          mechanic_id?: string | null
          parts_used?: string | null
          rating?: number | null
          service_date?: string | null
          truck_id: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          driver_id?: string
          duration_minutes?: number | null
          id?: string
          issue?: string
          mechanic_id?: string | null
          parts_used?: string | null
          rating?: number | null
          service_date?: string | null
          truck_id?: string
        }
        Relationships: []
      }
      trucks: {
        Row: {
          created_at: string | null
          current_location: string | null
          driver_id: string | null
          id: string
          last_service_date: string | null
          latitude: number | null
          longitude: number | null
          model: string | null
          owner_id: string
          registration_date: string | null
          status: string | null
          truck_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_location?: string | null
          driver_id?: string | null
          id?: string
          last_service_date?: string | null
          latitude?: number | null
          longitude?: number | null
          model?: string | null
          owner_id: string
          registration_date?: string | null
          status?: string | null
          truck_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_location?: string | null
          driver_id?: string | null
          id?: string
          last_service_date?: string | null
          latitude?: number | null
          longitude?: number | null
          model?: string | null
          owner_id?: string
          registration_date?: string | null
          status?: string | null
          truck_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "driver" | "mechanic" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["driver", "mechanic", "owner"],
    },
  },
} as const
