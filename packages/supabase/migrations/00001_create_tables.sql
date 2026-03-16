-- Devalaya Database Schema
-- Full migration for temple management platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- TEMPLES
-- ============================================
CREATE TABLE temples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  address JSONB NOT NULL DEFAULT '{}',
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_setup' CHECK (status IN ('active', 'inactive', 'pending_setup')),
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  timings JSONB DEFAULT '[]',
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  mux_stream_key TEXT,
  ein_number TEXT,
  tax_exempt_status BOOLEAN DEFAULT FALSE,
  default_language TEXT NOT NULL DEFAULT 'en',
  supported_languages TEXT[] DEFAULT ARRAY['en'],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_temples_slug ON temples(slug);
CREATE INDEX idx_temples_status ON temples(status);

-- ============================================
-- TEMPLE MEMBERS (admin roles)
-- ============================================
CREATE TABLE temple_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'priest', 'volunteer', 'staff')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(temple_id, user_id)
);

CREATE INDEX idx_temple_members_temple ON temple_members(temple_id);
CREATE INDEX idx_temple_members_user ON temple_members(user_id);

-- ============================================
-- FAMILIES
-- ============================================
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  family_name TEXT NOT NULL,
  head_devotee_id UUID,
  address JSONB,
  phone TEXT,
  email TEXT,
  gotra TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_families_temple ON families(temple_id);

-- ============================================
-- DEVOTEES
-- ============================================
CREATE TABLE devotees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gotra TEXT,
  nakshatra TEXT,
  rashi TEXT,
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  address JSONB,
  preferred_language TEXT DEFAULT 'en',
  communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true, "whatsapp": false}',
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  total_donations NUMERIC(12, 2) DEFAULT 0,
  last_visit_date DATE,
  membership_type TEXT DEFAULT 'none' CHECK (membership_type IN ('none', 'basic', 'premium', 'lifetime')),
  membership_expiry DATE,
  stripe_customer_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devotees_temple ON devotees(temple_id);
CREATE INDEX idx_devotees_user ON devotees(user_id);
CREATE INDEX idx_devotees_family ON devotees(family_id);
CREATE INDEX idx_devotees_email ON devotees(email);
CREATE INDEX idx_devotees_name ON devotees USING gin ((first_name || ' ' || last_name) gin_trgm_ops);

-- Add foreign key for family head after devotees table exists
ALTER TABLE families ADD CONSTRAINT fk_families_head_devotee
  FOREIGN KEY (head_devotee_id) REFERENCES devotees(id) ON DELETE SET NULL;

-- ============================================
-- PRIESTS
-- ============================================
CREATE TABLE priests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specializations TEXT[] DEFAULT ARRAY['general'],
  languages TEXT[] DEFAULT ARRAY['en'],
  bio TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_head_priest BOOLEAN DEFAULT FALSE,
  pujas_performed UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_priests_temple ON priests(temple_id);
CREATE INDEX idx_priests_user ON priests(user_id);

-- ============================================
-- PRIEST AVAILABILITY
-- ============================================
CREATE TABLE priest_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  priest_id UUID NOT NULL REFERENCES priests(id) ON DELETE CASCADE,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_booked BOOLEAN DEFAULT FALSE,
  booking_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_priest_availability_priest ON priest_availability(priest_id);
CREATE INDEX idx_priest_availability_date ON priest_availability(date);
CREATE INDEX idx_priest_availability_available ON priest_availability(is_available, is_booked);

-- ============================================
-- PUJAS
-- ============================================
CREATE TABLE pujas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_sanskrit TEXT,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('daily', 'weekly', 'special', 'festival', 'personal', 'homa', 'abhishekam', 'archana', 'other')),
  deity TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_devotees INTEGER,
  requires_priest BOOLEAN DEFAULT TRUE,
  is_bookable BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  instructions TEXT,
  items_provided TEXT[] DEFAULT '{}',
  items_to_bring TEXT[] DEFAULT '{}',
  available_days TEXT[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
  available_time_slots JSONB DEFAULT '[]',
  translations JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pujas_temple ON pujas(temple_id);
CREATE INDEX idx_pujas_category ON pujas(category);
CREATE INDEX idx_pujas_active ON pujas(is_active, is_bookable);

-- ============================================
-- PUJA BOOKINGS
-- ============================================
CREATE TABLE puja_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  puja_id UUID NOT NULL REFERENCES pujas(id) ON DELETE CASCADE,
  devotee_id UUID NOT NULL REFERENCES devotees(id) ON DELETE CASCADE,
  priest_id UUID REFERENCES priests(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  donation_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  devotee_names TEXT[] DEFAULT '{}',
  gotra TEXT,
  nakshatra TEXT,
  special_requests TEXT,
  cancellation_reason TEXT,
  confirmation_sent BOOLEAN DEFAULT FALSE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_temple ON puja_bookings(temple_id);
CREATE INDEX idx_bookings_puja ON puja_bookings(puja_id);
CREATE INDEX idx_bookings_devotee ON puja_bookings(devotee_id);
CREATE INDEX idx_bookings_priest ON puja_bookings(priest_id);
CREATE INDEX idx_bookings_date ON puja_bookings(booking_date);
CREATE INDEX idx_bookings_status ON puja_bookings(status);

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('daily_puja', 'weekly_puja', 'festival', 'cultural', 'educational', 'youth', 'volunteer', 'fundraiser', 'community', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  location TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  livestream_id UUID,
  image_url TEXT,
  max_attendees INTEGER,
  current_rsvps INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT FALSE,
  registration_fee NUMERIC(10, 2) DEFAULT 0,
  organizer_id UUID REFERENCES devotees(id) ON DELETE SET NULL,
  volunteer_slots INTEGER DEFAULT 0,
  volunteer_filled INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  translations JSONB DEFAULT '{}',
  google_calendar_event_id TEXT,
  send_reminders BOOLEAN DEFAULT TRUE,
  reminder_hours_before INTEGER[] DEFAULT ARRAY[24, 1],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_temple ON events(temple_id);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(start_date, end_date);

-- ============================================
-- EVENT RSVPs
-- ============================================
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  devotee_id UUID NOT NULL REFERENCES devotees(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending', 'waitlisted')),
  guest_count INTEGER DEFAULT 0,
  notes TEXT,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'paid', 'refunded')),
  check_in_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, devotee_id)
);

CREATE INDEX idx_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_rsvps_devotee ON event_rsvps(devotee_id);

-- ============================================
-- DONATIONS
-- ============================================
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  devotee_id UUID REFERENCES devotees(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'puja_offering', 'festival_sponsorship', 'building_fund', 'education_fund', 'food_offering', 'flower_offering', 'maintenance', 'priest_dakshina', 'charity', 'other')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  method TEXT NOT NULL CHECK (method IN ('credit_card', 'debit_card', 'bank_transfer', 'cash', 'check', 'upi', 'other')),
  frequency TEXT DEFAULT 'one_time' CHECK (frequency IN ('one_time', 'weekly', 'monthly', 'quarterly', 'annually')),
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  donor_address JSONB,
  in_memory_of TEXT,
  in_honor_of TEXT,
  notes TEXT,
  fund_allocation TEXT,
  is_tax_deductible BOOLEAN DEFAULT TRUE,
  receipt_sent BOOLEAN DEFAULT FALSE,
  receipt_number TEXT,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_donations_temple ON donations(temple_id);
CREATE INDEX idx_donations_devotee ON donations(devotee_id);
CREATE INDEX idx_donations_type ON donations(type);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_date ON donations(transaction_date);
CREATE INDEX idx_donations_receipt ON donations(receipt_number);

-- ============================================
-- DONATION RECEIPTS
-- ============================================
CREATE TABLE donation_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  devotee_id UUID REFERENCES devotees(id) ON DELETE SET NULL,
  receipt_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  donation_date TIMESTAMPTZ NOT NULL,
  donor_name TEXT NOT NULL,
  donor_address JSONB,
  temple_name TEXT NOT NULL,
  temple_ein TEXT NOT NULL,
  temple_address TEXT NOT NULL,
  description TEXT NOT NULL,
  is_goods_or_services BOOLEAN DEFAULT FALSE,
  goods_or_services_value NUMERIC(10, 2) DEFAULT 0,
  goods_or_services_description TEXT,
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_receipts_donation ON donation_receipts(donation_id);
CREATE INDEX idx_receipts_temple ON donation_receipts(temple_id);
CREATE INDEX idx_receipts_devotee ON donation_receipts(devotee_id);

-- ============================================
-- ANNUAL STATEMENTS
-- ============================================
CREATE TABLE annual_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  devotee_id UUID NOT NULL REFERENCES devotees(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  total_donations NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_tax_deductible NUMERIC(12, 2) NOT NULL DEFAULT 0,
  donation_count INTEGER DEFAULT 0,
  donations_summary JSONB DEFAULT '[]',
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(temple_id, devotee_id, year)
);

CREATE INDEX idx_annual_statements_temple ON annual_statements(temple_id);
CREATE INDEX idx_annual_statements_devotee ON annual_statements(devotee_id);

-- ============================================
-- LIVESTREAMS
-- ============================================
CREATE TABLE livestreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'preparing', 'live', 'ended', 'errored')),
  mux_live_stream_id TEXT,
  mux_playback_id TEXT,
  mux_stream_key TEXT,
  mux_asset_id TEXT,
  rtmp_url TEXT,
  playback_url TEXT,
  thumbnail_url TEXT,
  scheduled_start TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  duration_seconds INTEGER,
  viewer_count INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  is_recorded BOOLEAN DEFAULT TRUE,
  recording_url TEXT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  chat_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_livestreams_temple ON livestreams(temple_id);
CREATE INDEX idx_livestreams_status ON livestreams(status);
CREATE INDEX idx_livestreams_event ON livestreams(event_id);

-- Add foreign key for events.livestream_id
ALTER TABLE events ADD CONSTRAINT fk_events_livestream
  FOREIGN KEY (livestream_id) REFERENCES livestreams(id) ON DELETE SET NULL;

-- ============================================
-- VOLUNTEERS
-- ============================================
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  devotee_id UUID NOT NULL REFERENCES devotees(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('active', 'inactive', 'pending_approval')),
  skills TEXT[] DEFAULT '{}',
  availability JSONB DEFAULT '[]',
  total_hours NUMERIC(8, 2) DEFAULT 0,
  notes TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  background_check_status TEXT DEFAULT 'not_required' CHECK (background_check_status IN ('not_required', 'pending', 'cleared', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(temple_id, devotee_id)
);

CREATE INDEX idx_volunteers_temple ON volunteers(temple_id);
CREATE INDEX idx_volunteers_devotee ON volunteers(devotee_id);
CREATE INDEX idx_volunteers_status ON volunteers(status);

-- ============================================
-- VOLUNTEER ASSIGNMENTS
-- ============================================
CREATE TABLE volunteer_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  hours_logged NUMERIC(6, 2) DEFAULT 0,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vol_assignments_volunteer ON volunteer_assignments(volunteer_id);
CREATE INDEX idx_vol_assignments_event ON volunteer_assignments(event_id);

-- ============================================
-- ANNOUNCEMENTS
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  channels TEXT[] DEFAULT ARRAY['in_app'],
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'devotees', 'volunteers', 'priests', 'families', 'custom')),
  target_tags TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  is_draft BOOLEAN DEFAULT TRUE,
  translations JSONB DEFAULT '{}',
  image_url TEXT,
  action_url TEXT,
  delivery_stats JSONB DEFAULT '{"total_recipients": 0, "delivered": 0, "opened": 0, "clicked": 0, "failed": 0}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_temple ON announcements(temple_id);
CREATE INDEX idx_announcements_draft ON announcements(is_draft);

-- ============================================
-- TEMPLE FINANCES
-- ============================================
CREATE TABLE temple_finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  reference_number TEXT,
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES puja_bookings(id) ON DELETE SET NULL,
  vendor_name TEXT,
  payment_method TEXT,
  receipt_url TEXT,
  notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  fund TEXT DEFAULT 'general',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_finances_temple ON temple_finances(temple_id);
CREATE INDEX idx_finances_type ON temple_finances(type);
CREATE INDEX idx_finances_date ON temple_finances(transaction_date);
CREATE INDEX idx_finances_category ON temple_finances(category);
CREATE INDEX idx_finances_fund ON temple_finances(fund);

-- ============================================
-- PUSH NOTIFICATION TOKENS
-- ============================================
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, token)
);

CREATE INDEX idx_push_tokens_user ON push_tokens(user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
    AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t
    );
  END LOOP;
END;
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE temple_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotees ENABLE ROW LEVEL SECURITY;
ALTER TABLE priests ENABLE ROW LEVEL SECURITY;
ALTER TABLE priest_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE pujas ENABLE ROW LEVEL SECURITY;
ALTER TABLE puja_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE temple_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is temple admin
CREATE OR REPLACE FUNCTION is_temple_admin(p_temple_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM temple_members
    WHERE temple_id = p_temple_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: check if user is temple member (any role)
CREATE OR REPLACE FUNCTION is_temple_member(p_temple_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM temple_members
    WHERE temple_id = p_temple_id
    AND user_id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Temples: anyone can read active temples, only admins can modify
CREATE POLICY "temples_read" ON temples FOR SELECT
  USING (status = 'active' OR is_temple_member(id));

CREATE POLICY "temples_insert" ON temples FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "temples_update" ON temples FOR UPDATE
  USING (is_temple_admin(id));

-- Temple Members: members can read, admins can modify
CREATE POLICY "temple_members_read" ON temple_members FOR SELECT
  USING (is_temple_member(temple_id) OR user_id = auth.uid());

CREATE POLICY "temple_members_insert" ON temple_members FOR INSERT
  WITH CHECK (is_temple_admin(temple_id));

CREATE POLICY "temple_members_update" ON temple_members FOR UPDATE
  USING (is_temple_admin(temple_id));

CREATE POLICY "temple_members_delete" ON temple_members FOR DELETE
  USING (is_temple_admin(temple_id));

-- Devotees: members can read, admins can modify, devotees can read own
CREATE POLICY "devotees_read" ON devotees FOR SELECT
  USING (is_temple_member(temple_id) OR user_id = auth.uid());

CREATE POLICY "devotees_insert" ON devotees FOR INSERT
  WITH CHECK (is_temple_member(temple_id) OR user_id = auth.uid());

CREATE POLICY "devotees_update" ON devotees FOR UPDATE
  USING (is_temple_admin(temple_id) OR user_id = auth.uid());

-- Pujas: anyone can read active pujas, admins can modify
CREATE POLICY "pujas_read" ON pujas FOR SELECT
  USING (is_active = TRUE OR is_temple_member(temple_id));

CREATE POLICY "pujas_insert" ON pujas FOR INSERT
  WITH CHECK (is_temple_admin(temple_id));

CREATE POLICY "pujas_update" ON pujas FOR UPDATE
  USING (is_temple_admin(temple_id));

-- Puja Bookings: devotees see own, admins see all
CREATE POLICY "bookings_read" ON puja_bookings FOR SELECT
  USING (
    is_temple_member(temple_id)
    OR devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
  );

CREATE POLICY "bookings_insert" ON puja_bookings FOR INSERT
  WITH CHECK (
    devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
    OR is_temple_member(temple_id)
  );

CREATE POLICY "bookings_update" ON puja_bookings FOR UPDATE
  USING (is_temple_member(temple_id));

-- Events: published events are public, admins manage
CREATE POLICY "events_read" ON events FOR SELECT
  USING (status = 'published' OR is_temple_member(temple_id));

CREATE POLICY "events_insert" ON events FOR INSERT
  WITH CHECK (is_temple_admin(temple_id));

CREATE POLICY "events_update" ON events FOR UPDATE
  USING (is_temple_admin(temple_id));

-- Event RSVPs: devotees manage own RSVPs
CREATE POLICY "rsvps_read" ON event_rsvps FOR SELECT
  USING (
    is_temple_member(
      (SELECT temple_id FROM events WHERE id = event_id)
    )
    OR devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
  );

CREATE POLICY "rsvps_insert" ON event_rsvps FOR INSERT
  WITH CHECK (
    devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
  );

CREATE POLICY "rsvps_update" ON event_rsvps FOR UPDATE
  USING (
    devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
    OR is_temple_member(
      (SELECT temple_id FROM events WHERE id = event_id)
    )
  );

-- Donations: devotees see own, admins see all
CREATE POLICY "donations_read" ON donations FOR SELECT
  USING (
    is_temple_member(temple_id)
    OR devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
  );

CREATE POLICY "donations_insert" ON donations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Donation Receipts
CREATE POLICY "receipts_read" ON donation_receipts FOR SELECT
  USING (
    is_temple_member(temple_id)
    OR devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
  );

-- Annual Statements
CREATE POLICY "statements_read" ON annual_statements FOR SELECT
  USING (
    is_temple_member(temple_id)
    OR devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid())
  );

-- Livestreams: public ones readable by all, admins manage
CREATE POLICY "livestreams_read" ON livestreams FOR SELECT
  USING (is_public = TRUE OR is_temple_member(temple_id));

CREATE POLICY "livestreams_insert" ON livestreams FOR INSERT
  WITH CHECK (is_temple_admin(temple_id));

CREATE POLICY "livestreams_update" ON livestreams FOR UPDATE
  USING (is_temple_admin(temple_id));

-- Priests: temple members can read
CREATE POLICY "priests_read" ON priests FOR SELECT
  USING (is_temple_member(temple_id) OR is_active = TRUE);

CREATE POLICY "priests_manage" ON priests FOR ALL
  USING (is_temple_admin(temple_id));

-- Priest Availability
CREATE POLICY "availability_read" ON priest_availability FOR SELECT
  USING (is_temple_member(temple_id));

CREATE POLICY "availability_manage" ON priest_availability FOR ALL
  USING (is_temple_admin(temple_id) OR priest_id IN (SELECT id FROM priests WHERE user_id = auth.uid()));

-- Families
CREATE POLICY "families_read" ON families FOR SELECT
  USING (is_temple_member(temple_id));

CREATE POLICY "families_manage" ON families FOR ALL
  USING (is_temple_admin(temple_id));

-- Volunteers
CREATE POLICY "volunteers_read" ON volunteers FOR SELECT
  USING (is_temple_member(temple_id) OR devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid()));

CREATE POLICY "volunteers_insert" ON volunteers FOR INSERT
  WITH CHECK (devotee_id IN (SELECT id FROM devotees WHERE user_id = auth.uid()) OR is_temple_admin(temple_id));

CREATE POLICY "volunteers_update" ON volunteers FOR UPDATE
  USING (is_temple_admin(temple_id));

-- Volunteer Assignments
CREATE POLICY "vol_assignments_read" ON volunteer_assignments FOR SELECT
  USING (is_temple_member(temple_id));

CREATE POLICY "vol_assignments_manage" ON volunteer_assignments FOR ALL
  USING (is_temple_admin(temple_id));

-- Announcements
CREATE POLICY "announcements_read" ON announcements FOR SELECT
  USING (is_draft = FALSE OR is_temple_member(temple_id));

CREATE POLICY "announcements_manage" ON announcements FOR ALL
  USING (is_temple_admin(temple_id));

-- Temple Finances: admin only
CREATE POLICY "finances_read" ON temple_finances FOR SELECT
  USING (is_temple_admin(temple_id));

CREATE POLICY "finances_manage" ON temple_finances FOR ALL
  USING (is_temple_admin(temple_id));

-- Push Tokens: users manage own
CREATE POLICY "push_tokens_read" ON push_tokens FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "push_tokens_insert" ON push_tokens FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "push_tokens_delete" ON push_tokens FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('temple-logos', 'temple-logos', true),
  ('temple-covers', 'temple-covers', true),
  ('event-images', 'event-images', true),
  ('puja-images', 'puja-images', true),
  ('profile-images', 'profile-images', true),
  ('donation-receipts', 'donation-receipts', false),
  ('annual-statements', 'annual-statements', false);
