// ============================================
// RVR COLORIDO 2K26 — Type Definitions
// ============================================

// ---------- Events ----------
export type EventCategory = 'cultural' | 'sports';

export type CulturalSubcategory =
  | 'fine-arts'
  | 'music'
  | 'dance'
  | 'choreoday'
  | 'dramatics'
  | 'fashion-show'
  | 'tekraft'
  | 'literary';

export type SportsSubcategory =
  | 'basketball'
  | 'volleyball'
  | 'table-tennis'
  | 'throwball'
  | 'tennikoit';

export type EventGender = 'boys' | 'girls' | 'mixed' | 'open';

export interface Event {
  id: string;
  name: string;
  slug: string;
  category: EventCategory;
  subcategory: string;
  gender: EventGender;
  description: string;
  rules: string[];
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  registration_open: boolean;
  image_url: string | null;
  eligibility?: string;
  created_at: string;
  updated_at: string;
}

// ---------- Colleges ----------
export interface College {
  id: string;
  name: string;
  short_name: string;
  code: string;
  is_participating: boolean;
  is_active?: boolean;
  created_at: string;
}

// ---------- Registrations ----------
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Registration {
  id: string;
  registration_id: string; // e.g. CLR26-00001
  full_name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  gender: string;
  event_id: string;
  team_name: string | null;
  participant_count: number;
  additional_info: string | null;
  status: RegistrationStatus;
  created_at: string;
  // Joined fields
  event?: Event;
}

// ---------- Announcements ----------
export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: AnnouncementPriority;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- Results ----------
export interface Result {
  id: string;
  event_id: string;
  position: number;
  participant_name: string;
  team_name: string | null;
  college: string;
  score: string | null;
  remarks: string | null;
  published: boolean;
  created_at: string;
  // Joined fields
  event?: Event;
}

// ---------- Gallery ----------
export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description: string | null;
  created_at: string;
}

// ---------- Sponsors ----------
export type SponsorshipLevel = 'title' | 'gold' | 'silver' | 'supporting';

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website: string | null;
  sponsorship_level: SponsorshipLevel;
  created_at: string;
}

// ---------- Profiles ----------
export type UserRole = 'admin' | 'organizer';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

// ---------- Registration Form ----------
export interface RegistrationFormData {
  full_name: string;
  roll_number: string;
  department: string;
  year: string;
  phone: string;
  email: string;
  category: EventCategory | string;
  event_id: string;
  team_name?: string;
  participant_count?: number;
  additional_info?: string;
  agreement: boolean;
  // Compatibility fields
  college?: string;
  course?: string;
  gender?: string;
}

// ---------- Dashboard Stats ----------
export interface DashboardStats {
  totalRegistrations: number;
  totalEvents: number;
  culturalEvents: number;
  sportsEvents: number;
  publishedAnnouncements: number;
  publishedResults: number;
}
