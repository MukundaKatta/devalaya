export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      temples: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          address: Json;
          phone: string | null;
          email: string | null;
          website: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          status: "active" | "inactive" | "pending_setup";
          timezone: string;
          timings: Json;
          stripe_account_id: string | null;
          stripe_onboarding_complete: boolean;
          mux_stream_key: string | null;
          ein_number: string | null;
          tax_exempt_status: boolean;
          default_language: string;
          supported_languages: string[];
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["temples"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["temples"]["Insert"]>;
      };
      temple_members: {
        Row: {
          id: string;
          temple_id: string;
          user_id: string;
          role: "owner" | "admin" | "priest" | "volunteer" | "staff";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["temple_members"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["temple_members"]["Insert"]>;
      };
      devotees: {
        Row: {
          id: string;
          user_id: string | null;
          temple_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          gotra: string | null;
          nakshatra: string | null;
          rashi: string | null;
          family_id: string | null;
          address: Json | null;
          preferred_language: string;
          communication_preferences: Json;
          profile_image_url: string | null;
          is_active: boolean;
          tags: string[];
          notes: string | null;
          total_donations: number;
          last_visit_date: string | null;
          membership_type: "none" | "basic" | "premium" | "lifetime";
          membership_expiry: string | null;
          stripe_customer_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["devotees"]["Row"], "id" | "created_at" | "updated_at" | "total_donations"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          total_donations?: number;
        };
        Update: Partial<Database["public"]["Tables"]["devotees"]["Insert"]>;
      };
      families: {
        Row: {
          id: string;
          temple_id: string;
          family_name: string;
          head_devotee_id: string | null;
          address: Json | null;
          phone: string | null;
          email: string | null;
          gotra: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["families"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
      };
      priests: {
        Row: {
          id: string;
          user_id: string | null;
          temple_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          specializations: string[];
          languages: string[];
          bio: string | null;
          profile_image_url: string | null;
          is_active: boolean;
          is_head_priest: boolean;
          pujas_performed: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["priests"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["priests"]["Insert"]>;
      };
      pujas: {
        Row: {
          id: string;
          temple_id: string;
          name: string;
          name_sanskrit: string | null;
          description: string | null;
          category: string;
          deity: string | null;
          duration_minutes: number;
          base_price: number;
          max_devotees: number | null;
          requires_priest: boolean;
          is_bookable: boolean;
          is_active: boolean;
          image_url: string | null;
          instructions: string | null;
          items_provided: string[];
          items_to_bring: string[];
          available_days: string[];
          available_time_slots: Json;
          translations: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pujas"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pujas"]["Insert"]>;
      };
      puja_bookings: {
        Row: {
          id: string;
          temple_id: string;
          puja_id: string;
          devotee_id: string;
          priest_id: string | null;
          booking_date: string;
          start_time: string;
          end_time: string;
          status: string;
          amount: number;
          donation_amount: number;
          total_amount: number;
          payment_intent_id: string | null;
          payment_status: string;
          devotee_names: string[];
          gotra: string | null;
          nakshatra: string | null;
          special_requests: string | null;
          cancellation_reason: string | null;
          confirmation_sent: boolean;
          reminder_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["puja_bookings"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["puja_bookings"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          temple_id: string;
          title: string;
          description: string | null;
          type: string;
          status: string;
          start_date: string;
          end_date: string;
          is_all_day: boolean;
          is_recurring: boolean;
          recurrence_rule: string | null;
          location: string | null;
          is_virtual: boolean;
          virtual_link: string | null;
          livestream_id: string | null;
          image_url: string | null;
          max_attendees: number | null;
          current_rsvps: number;
          registration_required: boolean;
          registration_fee: number;
          organizer_id: string | null;
          volunteer_slots: number;
          volunteer_filled: number;
          tags: string[];
          translations: Json;
          google_calendar_event_id: string | null;
          send_reminders: boolean;
          reminder_hours_before: number[];
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at" | "updated_at" | "current_rsvps" | "volunteer_filled"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          current_rsvps?: number;
          volunteer_filled?: number;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          devotee_id: string;
          status: string;
          guest_count: number;
          notes: string | null;
          payment_intent_id: string | null;
          payment_status: string;
          check_in_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["event_rsvps"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["event_rsvps"]["Insert"]>;
      };
      donations: {
        Row: {
          id: string;
          temple_id: string;
          devotee_id: string | null;
          type: string;
          amount: number;
          currency: string;
          method: string;
          frequency: string;
          stripe_payment_intent_id: string | null;
          stripe_subscription_id: string | null;
          payment_status: string;
          is_anonymous: boolean;
          donor_name: string | null;
          donor_email: string | null;
          donor_phone: string | null;
          donor_address: Json | null;
          in_memory_of: string | null;
          in_honor_of: string | null;
          notes: string | null;
          fund_allocation: string | null;
          is_tax_deductible: boolean;
          receipt_sent: boolean;
          receipt_number: string | null;
          transaction_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["donations"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["donations"]["Insert"]>;
      };
      donation_receipts: {
        Row: {
          id: string;
          donation_id: string;
          temple_id: string;
          devotee_id: string | null;
          receipt_number: string;
          amount: number;
          currency: string;
          donation_date: string;
          donor_name: string;
          donor_address: Json | null;
          temple_name: string;
          temple_ein: string;
          temple_address: string;
          description: string;
          is_goods_or_services: boolean;
          goods_or_services_value: number;
          goods_or_services_description: string | null;
          pdf_url: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["donation_receipts"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["donation_receipts"]["Insert"]>;
      };
      livestreams: {
        Row: {
          id: string;
          temple_id: string;
          title: string;
          description: string | null;
          status: string;
          mux_live_stream_id: string | null;
          mux_playback_id: string | null;
          mux_stream_key: string | null;
          mux_asset_id: string | null;
          rtmp_url: string | null;
          playback_url: string | null;
          thumbnail_url: string | null;
          scheduled_start: string | null;
          actual_start: string | null;
          actual_end: string | null;
          duration_seconds: number | null;
          viewer_count: number;
          peak_viewers: number;
          is_recorded: boolean;
          recording_url: string | null;
          event_id: string | null;
          is_public: boolean;
          chat_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["livestreams"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["livestreams"]["Insert"]>;
      };
      volunteers: {
        Row: {
          id: string;
          temple_id: string;
          devotee_id: string;
          status: string;
          skills: string[];
          availability: Json;
          total_hours: number;
          notes: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          background_check_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["volunteers"]["Row"], "id" | "created_at" | "updated_at" | "total_hours"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          total_hours?: number;
        };
        Update: Partial<Database["public"]["Tables"]["volunteers"]["Insert"]>;
      };
      announcements: {
        Row: {
          id: string;
          temple_id: string;
          title: string;
          body: string;
          priority: string;
          channels: string[];
          target_audience: string;
          target_tags: string[];
          scheduled_at: string | null;
          sent_at: string | null;
          is_draft: boolean;
          translations: Json;
          image_url: string | null;
          action_url: string | null;
          delivery_stats: Json;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["announcements"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
      temple_finances: {
        Row: {
          id: string;
          temple_id: string;
          type: "income" | "expense";
          category: string;
          amount: number;
          currency: string;
          description: string;
          transaction_date: string;
          reference_number: string | null;
          donation_id: string | null;
          booking_id: string | null;
          vendor_name: string | null;
          payment_method: string | null;
          receipt_url: string | null;
          notes: string | null;
          approved_by: string | null;
          fund: string;
          is_recurring: boolean;
          recurrence_rule: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["temple_finances"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["temple_finances"]["Insert"]>;
      };
    };
    Functions: {
      is_temple_admin: {
        Args: { p_temple_id: string };
        Returns: boolean;
      };
      is_temple_member: {
        Args: { p_temple_id: string };
        Returns: boolean;
      };
    };
  };
}
