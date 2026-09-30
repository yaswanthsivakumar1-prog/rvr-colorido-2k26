'use server';

import { createClient } from '@/lib/supabase/server';
import type { Registration, Profile } from '@/types';
import { isSupabaseConfigured, MOCK_REGISTRATIONS } from '@/lib/data/mock-data';

/**
 * Fetch profile and registrations for a logged-in student.
 */
export async function getStudentData(userId?: string, email?: string): Promise<{
  profile: Profile | null;
  registrations: Registration[];
}> {
  if (!isSupabaseConfigured()) {
    // Demonstration / Mock fallback
    const matched = email
      ? MOCK_REGISTRATIONS.filter((r) => r.email.toLowerCase() === email.toLowerCase())
      : MOCK_REGISTRATIONS.slice(0, 2);

    return {
      profile: {
        id: userId || 'std-demo-1',
        full_name: matched[0]?.full_name || 'RVR Student Participant',
        role: 'student',
        college: matched[0]?.college || 'R.V.R. & J.C. College of Engineering (Autonomous)',
        roll_number: 'Y22CS501',
        department: matched[0]?.course || 'Computer Science & Engineering (CSE)',
        created_at: new Date().toISOString(),
      },
      registrations: matched,
    };
  }

  try {
    const supabase = await createClient();

    // 1. Fetch Profile
    let profile: Profile | null = null;
    if (userId) {
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profData) {
        profile = profData as Profile;
      }
    }

    // 2. Fetch Registrations
    let query = supabase
      .from('registrations')
      .select('*, event:events(*)')
      .order('created_at', { ascending: false });

    if (userId && email) {
      query = query.or(`user_id.eq.${userId},email.eq.${email.trim().toLowerCase()}`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('email', email.trim().toLowerCase());
    }

    let { data: regData, error: regError } = await query;

    if (regError && regError.message?.toLowerCase().includes('user_id') && email) {
      const fallback = await supabase
        .from('registrations')
        .select('*, event:events(*)')
        .eq('email', email.trim().toLowerCase())
        .order('created_at', { ascending: false });
      if (!fallback.error) {
        regData = fallback.data;
        regError = null;
      }
    }

    if (regError) {
      console.warn('Supabase fetch student registrations failed:', regError.message);
      return { profile, registrations: [] };
    }

    return {
      profile,
      registrations: (regData as Registration[]) || [],
    };
  } catch (err) {
    console.warn('Exception in getStudentData:', err);
    return { profile: null, registrations: [] };
  }
}

/**
 * Fast lookup for a student's registration pass by Registration ID (e.g. CLR26-1001)
 */
export async function lookupStudentPass(
  registrationId: string,
  rollNumber?: string
): Promise<{ success: boolean; registration?: Registration; error?: string }> {
  const cleanId = registrationId.trim().toUpperCase();
  if (!cleanId) {
    return { success: false, error: 'Registration ID is required.' };
  }

  if (!isSupabaseConfigured()) {
    const found = MOCK_REGISTRATIONS.find(
      (r) =>
        r.registration_id.toUpperCase() === cleanId ||
        (rollNumber && r.additional_info?.toUpperCase().includes(rollNumber.trim().toUpperCase()))
    );

    if (found) {
      return { success: true, registration: found };
    }
    return { success: false, error: 'No registration pass found matching this ID.' };
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from('registrations')
      .select('*, event:events(*)')
      .eq('registration_id', cleanId);

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      // Also try fallback by roll number if provided
      if (rollNumber) {
        const { data: rollData } = await supabase
          .from('registrations')
          .select('*, event:events(*)')
          .ilike('additional_info', `%${rollNumber.trim()}%`)
          .limit(1)
          .maybeSingle();

        if (rollData) {
          return { success: true, registration: rollData as Registration };
        }
      }

      return {
        success: false,
        error: error?.message || 'No registration pass found with this Registration ID.',
      };
    }

    return { success: true, registration: data as Registration };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to lookup registration pass.' };
  }
}
