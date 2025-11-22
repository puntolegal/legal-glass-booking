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
      family_quiz_responses: {
        Row: {
          bienes: string | null
          contacted: boolean | null
          created_at: string | null
          email: string
          empresa: string | null
          id: string
          internacional: string | null
          nombre: string | null
          recommended_plan: string
          servicio: string
          status: string | null
        }
        Insert: {
          bienes?: string | null
          contacted?: boolean | null
          created_at?: string | null
          email: string
          empresa?: string | null
          id?: string
          internacional?: string | null
          nombre?: string | null
          recommended_plan: string
          servicio: string
          status?: string | null
        }
        Update: {
          bienes?: string | null
          contacted?: boolean | null
          created_at?: string | null
          email?: string
          empresa?: string | null
          id?: string
          internacional?: string | null
          nombre?: string | null
          recommended_plan?: string
          servicio?: string
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          nombre: string | null
          role: string
          telefono: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          nombre?: string | null
          role?: string
          telefono?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          nombre?: string | null
          role?: string
          telefono?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reservas: {
        Row: {
          created_at: string | null
          descripcion: string | null
          email: string
          email_enviado: boolean | null
          email_enviado_at: string | null
          estado: string | null
          external_reference: string | null
          fecha: string
          hora: string
          id: string
          nombre: string
          pago_estado: string | null
          precio: string
          preference_id: string | null
          recordatorio_enviado: boolean | null
          rut: string | null
          servicio: string
          telefono: string
          tipo_reunion: string | null
          updated_at: string | null
          webhook_sent: boolean | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          email: string
          email_enviado?: boolean | null
          email_enviado_at?: string | null
          estado?: string | null
          external_reference?: string | null
          fecha: string
          hora: string
          id?: string
          nombre: string
          pago_estado?: string | null
          precio: string
          preference_id?: string | null
          recordatorio_enviado?: boolean | null
          rut?: string | null
          servicio: string
          telefono: string
          tipo_reunion?: string | null
          updated_at?: string | null
          webhook_sent?: boolean | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          email?: string
          email_enviado?: boolean | null
          email_enviado_at?: string | null
          estado?: string | null
          external_reference?: string | null
          fecha?: string
          hora?: string
          id?: string
          nombre?: string
          pago_estado?: string | null
          precio?: string
          preference_id?: string | null
          recordatorio_enviado?: boolean | null
          rut?: string | null
          servicio?: string
          telefono?: string
          tipo_reunion?: string | null
          updated_at?: string | null
          webhook_sent?: boolean | null
        }
        Relationships: []
      }
      reservas_backup: {
        Row: {
          categoria: string | null
          cliente_email: string | null
          cliente_nombre: string | null
          cliente_telefono: string | null
          created_at: string | null
          descripcion: string | null
          email: string | null
          email_enviado: boolean | null
          email_enviado_at: string | null
          estado: string | null
          external_reference: string | null
          fecha: string | null
          fecha_agendada: string | null
          hora: string | null
          hora_agendada: string | null
          id: string | null
          motivo_consulta: string | null
          nombre: string | null
          notas: string | null
          pago_estado: string | null
          pago_id: string | null
          pago_metodo: string | null
          precio: string | null
          preference_id: string | null
          recordatorio_enviado: boolean | null
          rut: string | null
          servicio: string | null
          servicio_nombre: string | null
          servicio_precio: number | null
          telefono: string | null
          tipo_reunion: string | null
          updated_at: string | null
          user_id: string | null
          webhook_sent: boolean | null
        }
        Insert: {
          categoria?: string | null
          cliente_email?: string | null
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          created_at?: string | null
          descripcion?: string | null
          email?: string | null
          email_enviado?: boolean | null
          email_enviado_at?: string | null
          estado?: string | null
          external_reference?: string | null
          fecha?: string | null
          fecha_agendada?: string | null
          hora?: string | null
          hora_agendada?: string | null
          id?: string | null
          motivo_consulta?: string | null
          nombre?: string | null
          notas?: string | null
          pago_estado?: string | null
          pago_id?: string | null
          pago_metodo?: string | null
          precio?: string | null
          preference_id?: string | null
          recordatorio_enviado?: boolean | null
          rut?: string | null
          servicio?: string | null
          servicio_nombre?: string | null
          servicio_precio?: number | null
          telefono?: string | null
          tipo_reunion?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_sent?: boolean | null
        }
        Update: {
          categoria?: string | null
          cliente_email?: string | null
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          created_at?: string | null
          descripcion?: string | null
          email?: string | null
          email_enviado?: boolean | null
          email_enviado_at?: string | null
          estado?: string | null
          external_reference?: string | null
          fecha?: string | null
          fecha_agendada?: string | null
          hora?: string | null
          hora_agendada?: string | null
          id?: string | null
          motivo_consulta?: string | null
          nombre?: string | null
          notas?: string | null
          pago_estado?: string | null
          pago_id?: string | null
          pago_metodo?: string | null
          precio?: string | null
          preference_id?: string | null
          recordatorio_enviado?: boolean | null
          rut?: string | null
          servicio?: string | null
          servicio_nombre?: string | null
          servicio_precio?: number | null
          telefono?: string | null
          tipo_reunion?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_sent?: boolean | null
        }
        Relationships: []
      }
      apuntes_audits: {
        Row: {
          id: string
          note_id: string
          auditor_id: string
          auditor_name: string
          audited_at: string
          comments: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          note_id: string
          auditor_id: string
          auditor_name: string
          audited_at?: string
          comments?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          auditor_id?: string
          auditor_name?: string
          audited_at?: string
          comments?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads_quiz: {
        Row: {
          id: string
          name: string
          email: string
          quiz_answers: Json
          plan_recommended: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          quiz_answers: Json
          plan_recommended?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          quiz_answers?: Json
          plan_recommended?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
>>>>>>> bb1da85 (feat: Agregar tabla apuntes_audits a Supabase y actualizar tipos TypeScript)
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
    Enums: {},
  },
} as const
