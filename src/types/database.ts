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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      car_images: {
        Row: {
          alt_text: string | null
          car_id: string
          created_at: string | null
          display_order: number
          id: string
          is_primary: boolean | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          car_id: string
          created_at?: string | null
          display_order?: number
          id?: string
          is_primary?: boolean | null
          url: string
        }
        Update: {
          alt_text?: string | null
          car_id?: string
          created_at?: string | null
          display_order?: number
          id?: string
          is_primary?: boolean | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          brand_id: string
          category_id: string
          condition: Database["public"]["Enums"]["car_condition"]
          created_at: string | null
          currency: string
          description: string | null
          engine_displacement: number | null
          exterior_color: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          has_damage_record: boolean | null
          has_service_history: boolean | null
          horsepower: number | null
          id: string
          interior_color: string | null
          is_featured: boolean | null
          location: string | null
          mileage_km: number
          model: string
          price: number
          slug: string
          status: Database["public"]["Enums"]["car_status"]
          transmission: Database["public"]["Enums"]["transmission_type"]
          updated_at: string | null
          view_count: number | null
          vin: string | null
          year: number
        }
        Insert: {
          brand_id: string
          category_id: string
          condition?: Database["public"]["Enums"]["car_condition"]
          created_at?: string | null
          currency?: string
          description?: string | null
          engine_displacement?: number | null
          exterior_color?: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          has_damage_record?: boolean | null
          has_service_history?: boolean | null
          horsepower?: number | null
          id?: string
          interior_color?: string | null
          is_featured?: boolean | null
          location?: string | null
          mileage_km?: number
          model: string
          price: number
          slug: string
          status?: Database["public"]["Enums"]["car_status"]
          transmission: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string | null
          view_count?: number | null
          vin?: string | null
          year: number
        }
        Update: {
          brand_id?: string
          category_id?: string
          condition?: Database["public"]["Enums"]["car_condition"]
          created_at?: string | null
          currency?: string
          description?: string | null
          engine_displacement?: number | null
          exterior_color?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          has_damage_record?: boolean | null
          has_service_history?: boolean | null
          horsepower?: number | null
          id?: string
          interior_color?: string | null
          is_featured?: boolean | null
          location?: string | null
          mileage_km?: number
          model?: string
          price?: number
          slug?: string
          status?: Database["public"]["Enums"]["car_status"]
          transmission?: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string | null
          view_count?: number | null
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "cars_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cars_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          car_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          admin_notes: string | null
          car_id: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          inquiry_type: Database["public"]["Enums"]["inquiry_type"]
          message: string
          phone: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          car_id?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          inquiry_type?: Database["public"]["Enums"]["inquiry_type"]
          message: string
          phone?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          car_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          inquiry_type?: Database["public"]["Enums"]["inquiry_type"]
          message?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      car_condition: "yeni" | "ikinci_el" | "koleksiyon"
      car_status: "musait" | "rezerve" | "satildi"
      fuel_type: "benzin" | "dizel" | "hybrid" | "elektrik"
      inquiry_status: "yeni" | "gorusuldu" | "tamamlandi" | "iptal"
      inquiry_type: "bilgi" | "test_surusu" | "fiyat_teklifi"
      transmission_type: "manuel" | "otomatik" | "yari_otomatik"
      user_role: "user" | "admin"
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
      car_condition: ["yeni", "ikinci_el", "koleksiyon"],
      car_status: ["musait", "rezerve", "satildi"],
      fuel_type: ["benzin", "dizel", "hybrid", "elektrik"],
      inquiry_status: ["yeni", "gorusuldu", "tamamlandi", "iptal"],
      inquiry_type: ["bilgi", "test_surusu", "fiyat_teklifi"],
      transmission_type: ["manuel", "otomatik", "yari_otomatik"],
      user_role: ["user", "admin"],
    },
  },
} as const
