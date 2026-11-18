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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      cad_downloads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          facing: string | null
          family: string
          format: string
          id: string
          material: string | null
          name: string | null
          part_code: string
          phone: string
          referrer: string | null
          size: string | null
          spec: string | null
          standard: string | null
          user_agent: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          facing?: string | null
          family: string
          format: string
          id?: string
          material?: string | null
          name?: string | null
          part_code: string
          phone: string
          referrer?: string | null
          size?: string | null
          spec?: string | null
          standard?: string | null
          user_agent?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          facing?: string | null
          family?: string
          format?: string
          id?: string
          material?: string | null
          name?: string | null
          part_code?: string
          phone?: string
          referrer?: string | null
          size?: string | null
          spec?: string | null
          standard?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      client_documents: {
        Row: {
          created_at: string
          doc_type: string
          id: string
          issued_on: string
          order_id: string | null
          owner_email: string
          reference: string | null
          storage_path: string | null
          title: string
        }
        Insert: {
          created_at?: string
          doc_type?: string
          id?: string
          issued_on?: string
          order_id?: string | null
          owner_email: string
          reference?: string | null
          storage_path?: string | null
          title: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          id?: string
          issued_on?: string
          order_id?: string | null
          owner_email?: string
          reference?: string | null
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "client_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      client_order_lines: {
        Row: {
          created_at: string
          description: string
          heat_ref: string | null
          id: string
          material_slug: string | null
          order_id: string
          product_slug: string | null
          quantity: number
          size: string | null
          unit: string
        }
        Insert: {
          created_at?: string
          description: string
          heat_ref?: string | null
          id?: string
          material_slug?: string | null
          order_id: string
          product_slug?: string | null
          quantity?: number
          size?: string | null
          unit?: string
        }
        Update: {
          created_at?: string
          description?: string
          heat_ref?: string | null
          id?: string
          material_slug?: string | null
          order_id?: string
          product_slug?: string | null
          quantity?: number
          size?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_order_lines_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "client_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      client_orders: {
        Row: {
          bl_number: string | null
          carrier: string | null
          container_no: string | null
          created_at: string
          currency: string
          destination_port: string | null
          dispatched_on: string | null
          eta: string | null
          id: string
          incoterm: string | null
          order_value: number
          owner_email: string
          po_number: string
          project_name: string | null
          status: string
          total_weight_kg: number
          vessel: string | null
        }
        Insert: {
          bl_number?: string | null
          carrier?: string | null
          container_no?: string | null
          created_at?: string
          currency?: string
          destination_port?: string | null
          dispatched_on?: string | null
          eta?: string | null
          id?: string
          incoterm?: string | null
          order_value?: number
          owner_email: string
          po_number: string
          project_name?: string | null
          status?: string
          total_weight_kg?: number
          vessel?: string | null
        }
        Update: {
          bl_number?: string | null
          carrier?: string | null
          container_no?: string | null
          created_at?: string
          currency?: string
          destination_port?: string | null
          dispatched_on?: string | null
          eta?: string | null
          id?: string
          incoterm?: string | null
          order_value?: number
          owner_email?: string
          po_number?: string
          project_name?: string | null
          status?: string
          total_weight_kg?: number
          vessel?: string | null
        }
        Relationships: []
      }
      document_downloads: {
        Row: {
          company: string | null
          created_at: string
          document_key: string
          document_title: string | null
          email: string
          id: string
          name: string | null
          phone: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          document_key: string
          document_title?: string | null
          email: string
          id?: string
          name?: string | null
          phone: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          document_key?: string
          document_title?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string
          contact_name: string
          country: string | null
          created_at: string
          email: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          email: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rfq_requests: {
        Row: {
          attachments: Json
          certification: string | null
          company: string
          confirmation_token: string
          contact_name: string
          country: string | null
          created_at: string
          delivery_port: string | null
          email: string
          id: string
          incoterm: string | null
          items: Json
          message: string | null
          owner_id: string | null
          phone: string | null
          project_name: string | null
          reference: string | null
          status: string
          target_lead_time: string | null
          testing: Json
        }
        Insert: {
          attachments?: Json
          certification?: string | null
          company: string
          confirmation_token?: string
          contact_name: string
          country?: string | null
          created_at?: string
          delivery_port?: string | null
          email: string
          id?: string
          incoterm?: string | null
          items?: Json
          message?: string | null
          owner_id?: string | null
          phone?: string | null
          project_name?: string | null
          reference?: string | null
          status?: string
          target_lead_time?: string | null
          testing?: Json
        }
        Update: {
          attachments?: Json
          certification?: string | null
          company?: string
          confirmation_token?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          delivery_port?: string | null
          email?: string
          id?: string
          incoterm?: string | null
          items?: Json
          message?: string | null
          owner_id?: string | null
          phone?: string | null
          project_name?: string | null
          reference?: string | null
          status?: string
          target_lead_time?: string | null
          testing?: Json
        }
        Relationships: []
      }
      stock_items: {
        Row: {
          category: string
          created_at: string
          grade: string
          grade_slug: string | null
          heat_ref: string | null
          id: string
          location: string
          product: string
          product_slug: string | null
          quantity: number
          rating: string | null
          size: string
          spec: string
          status: string
          unit: string
          verified_on: string
        }
        Insert: {
          category: string
          created_at?: string
          grade: string
          grade_slug?: string | null
          heat_ref?: string | null
          id?: string
          location?: string
          product: string
          product_slug?: string | null
          quantity?: number
          rating?: string | null
          size: string
          spec: string
          status?: string
          unit?: string
          verified_on?: string
        }
        Update: {
          category?: string
          created_at?: string
          grade?: string
          grade_slug?: string | null
          heat_ref?: string | null
          id?: string
          location?: string
          product?: string
          product_slug?: string | null
          quantity?: number
          rating?: string | null
          size?: string
          spec?: string
          status?: string
          unit?: string
          verified_on?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "staff" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "staff", "user"],
    },
  },
} as const
